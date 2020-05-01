from uuid import UUID

from django.conf import settings
from django.core.exceptions import ValidationError
from django.http import Http404
from django.shortcuts import render, redirect
from rest_framework import generics, mixins, status, exceptions
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from creation.models import ContributorRole, TutorialDetail, Language
from videoprocessing.models import VideoTutorial, VideoChunk
from videoprocessing.permissions import is_tutorial_allotted, IsContributor
from videoprocessing.serializers import ContributorTutorialsSerializer, VideoSerializer, VideoChunkSerializer, \
    ChangeAudioSerializer
from videoprocessing.tasks import copy_video_generate_checksum, new_audio_trim


def index(request):
    """
    The View which will load the frontend of App
    """
    if request.user.is_authenticated and ContributorRole.objects.filter(user=request.user).count():
        return render(request, 'videoprocessing/index.html')
    return redirect('%s?next=%s' % ('/accounts/login/', request.path))


# All the APIs

class ContributorTutorialsList(generics.ListAPIView):
    """
    Return a list of all the tutorials allotted to a particular contributor
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated, IsContributor]
    serializer_class = ContributorTutorialsSerializer

    def get_queryset(self):
        try:
            user = self.request.user
            tutorials = ContributorRole.objects.filter(user=user, status=True)
            return tutorials
        except ContributorRole.DoesNotExist:
            raise exceptions.NotFound('No Tutorials Found')


class VideoTutorialProcess(mixins.ListModelMixin, generics.GenericAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated, IsContributor]
    serializer_class = VideoSerializer

    def get_queryset(self):
        user = self.request.user
        return VideoTutorial.objects.filter(user=user)

    def get(self, request, *args, **kwargs):
        """All the Videos and subtitles uploaded will be listed"""
        print(request.user)
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """creating a new project"""
        try:
            tutorial_id = request.data['tutorial_detail']
            language_id = request.data['language']
            if is_tutorial_allotted(self.request.user, tutorial_id, language_id):
                tutorial_detail_object = TutorialDetail.objects.get(pk=tutorial_id)
                foss_id = tutorial_detail_object.foss_id
                tutorial_name = str(tutorial_detail_object).replace(" ", '-')
                language_name = str(Language.objects.get(pk=language_id).name)
                file_name = tutorial_name + '-' + language_name
                src = str(settings.MEDIA_ROOT + 'videos/' + str(foss_id) + '/' + str(tutorial_id) + '/' + file_name)
                print(src)
                serializer = VideoSerializer(data=request.data)
                if serializer.is_valid():
                    obj = serializer.save(user=request.user)
                    copy_video_generate_checksum.delay(obj.id, src)
                    return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_403_FORBIDDEN)
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class GetVideoChunk(generics.ListAPIView):
    """Endpoint that will list all chunks of a particular tutorial"""
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated, IsContributor]
    serializer_class = VideoChunkSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        print(pk)
        # TODO: This is to be refactored
        try:
            uuid_obj = UUID(pk, version=4)
            print(uuid_obj)
            try:
                chunk = VideoChunk.objects.filter(VideoTutorial=pk)
                return chunk
            except VideoChunk.DoesNotExist:
                raise exceptions.NotFound('Invalid Video ID')
        except ValueError:
            raise exceptions.NotFound('Invalid Video ID')

    def get(self, request, *args, **kwargs):
        """Return all chunks for particular video"""
        pk = self.kwargs['pk']
        print(pk)
        try:
            video_obj = VideoTutorial.objects.get(pk=pk)
            chunk = VideoChunk.objects.filter(VideoTutorial=pk)
            context = {'request': request}

            ser_video = VideoSerializer(video_obj, context=context)
            ser_chunk = VideoChunkSerializer(chunk, many=True, context=context)

            return Response({
                'video_data': ser_video.data,
                'chunks': ser_chunk.data})
        except ValidationError:
            return Response(
                {"details": 'error'},
                status=status.HTTP_400_BAD_REQUEST)


class ChangeAudio(generics.RetrieveUpdateAPIView):
    """End point to change audio of a particular chunk"""
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated, IsContributor]
    serializer_class = ChangeAudioSerializer
    queryset = VideoChunk.objects.all()

    def get_object(self):
        """it will return chunk with provided arguments"""
        try:
            return VideoChunk.objects.get(VideoTutorial=self.kwargs['pk'],
                                          chunk_no=self.kwargs['chunk_no'])
        except VideoChunk.DoesNotExist:
            raise Http404
        except ValidationError:
            raise exceptions.ValidationError('Invalid UUID Or Chunk No')

    def update(self, request, *args, **kwargs):
        """it will upload the new audio of specified chunk"""
        instance = self.get_object()
        instance.audio_chunk = request.data.get('audio_chunk')
        instance.save()
        serializer = ChangeAudioSerializer(instance)
        new_audio_trim.delay(serializer.data)
        return Response(serializer.data)
