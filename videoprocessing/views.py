from uuid import UUID

from django.conf import settings
from django.core.exceptions import ValidationError
from django.shortcuts import render, redirect
from rest_framework import generics, mixins, status, exceptions
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from creation.models import ContributorRole, TutorialDetail, Language
from videoprocessing.models import VideoTutorial, VideoChunk
from videoprocessing.serializers import ContributorTutorialsSerializer, VideoSerializer, VideoChunkSerializer
from videoprocessing.tasks import process_video


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
    This view should return a list of all the tutorials
    allotted to a particular contributor
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ContributorTutorialsSerializer

    def get_queryset(self):
        user = self.request.user
        return ContributorRole.objects.filter(user=user, status=True)


class VideoTutorialProcess(mixins.ListModelMixin, generics.GenericAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = VideoSerializer

    def get_queryset(self):
        user = self.request.user
        return VideoTutorial.objects.filter(user=user)

    # def get(self, request, *args, **kwargs):
    #     """All the Videos and subtitles uploaded will be listed"""
    #     print(request.user)
    #     return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """creating a new project"""
        tutorial_id = self.kwargs['tutorial_id']
        language_id = self.kwargs['language_id']
        print('check')
        if ContributorRole.objects.filter(user=request.user, tutorial_detail_id=tutorial_id,
                                          language_id=language_id).count():
            tutorial_detail_object = TutorialDetail.objects.get(pk=tutorial_id)
            foss_id = tutorial_detail_object.foss_id
            tutorial_name = str(tutorial_detail_object)
            tutorial_name = tutorial_name.replace(" ", '-')
            language_object = Language.objects.get(pk=language_id)
            language_name = language_object.name
            file_name = tutorial_name + '-' + language_name
            src = str(settings.MEDIA_ROOT + 'videos/' + str(foss_id) + '/' + str(tutorial_id) + '/' + file_name)
            print(src)
            video_tutorial_object = VideoTutorial(
                tutorial_detail=tutorial_detail_object,
                language=language_object,
                user=self.request.user
            )
            video_tutorial_object.save()
            process_video.delay(video_tutorial_object.id, src)
            return Response({'id': video_tutorial_object.id}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

        # serializer = VideoSerializer(data=request.data)
        # if serializer.is_valid():
        #     obj = serializer.save()
        #     # process_video.delay(obj.id)


class GetVideoChunk(generics.ListAPIView):
    """Endpoint that will list all chunks info of a video"""
    serializer_class = VideoChunkSerializer

    def get_queryset(self):
        """query from chunks who project id is provided as arguments """
        pk = self.kwargs['pk']
        print(pk)
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
