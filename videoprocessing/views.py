import traceback
from uuid import UUID

from django.conf import settings
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.http import Http404
from django.shortcuts import render, redirect
from rest_framework import generics, mixins, status, exceptions
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from creation.models import ContributorRole, TutorialDetail, Language, TutorialResource, DomainReviewerRole, \
    FossCategory
from videoprocessing.models import VideoTutorial, VideoChunk
from videoprocessing.permissions import is_tutorial_allotted, IsContributor, is_foss_allotted, IsDomainReviewer
from videoprocessing.serializers import ContributorTutorialsSerializer, VideoSerializer, VideoChunkSerializer, \
    ChangeAudioSerializer, ReviewerTutorialSerializer
from videoprocessing.tasks import fetch_video_generate_checksum, new_audio_trim


def index(request):
    """
    The View which will load the frontend of App
    """
    if request.user.is_authenticated and ContributorRole.objects.filter(user=request.user).count():
        return render(request, 'videoprocessing/client_index.html')
    elif request.user.is_authenticated and DomainReviewerRole.objects.filter(user=request.user).count():
        return render(request, 'videoprocessing/reviewer_index.html')
    return redirect('%s?next=%s' % ('/accounts/login/', request.path))


# Contributor APIs

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

                if VideoTutorial.objects.filter(tutorial_detail=tutorial_id, language=language_id):
                    return Response(status=status.HTTP_409_CONFLICT)

                tutorial_detail_object = TutorialDetail.objects.get(pk=tutorial_id)
                foss_id = tutorial_detail_object.foss_id
                tutorial_name = str(tutorial_detail_object).replace(" ", '-')
                language_name = str(Language.objects.get(pk=language_id).name)
                file_name = tutorial_name + '-' + language_name
                src = str(settings.MEDIA_ROOT + 'videos/' + str(foss_id) + '/' + str(tutorial_id) + '/' + file_name)
                print(src)
                file = TutorialResource.objects.get(tutorial_detail_id=tutorial_id, language_id=language_id)
                video_file_extension = "." + file.video.split('.')[-1]
                data = request.data
                _mutable = data._mutable
                data._mutable = True
                data['foss'] = foss_id
                data._mutable = _mutable
                print(data)
                serializer = VideoSerializer(data=data)
                if serializer.is_valid():
                    obj = serializer.save(user=request.user)
                    obj.foss = FossCategory.objects.get(id=foss_id)
                    obj.save()
                    fetch_video_generate_checksum.delay(obj.id, src, video_file_extension)
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
            video_obj = VideoTutorial.objects.get(pk=pk, user=request.user)
            chunk = VideoChunk.objects.filter(VideoTutorial=pk)
            context = {'request': request}

            ser_video = VideoSerializer(video_obj, context=context)

            meta_data = ser_video.data
            meta_data['tutorial_name'] = str(TutorialDetail.objects.get(pk=video_obj.tutorial_detail.pk))
            meta_data['language'] = str(Language.objects.get(pk=video_obj.language.pk))
            meta_data['foss'] = video_obj.tutorial_detail.foss.foss

            ser_chunk = VideoChunkSerializer(chunk, many=True, context=context)

            return Response({
                'video_data': meta_data,
                'chunks': ser_chunk.data})
        except (ValidationError, VideoTutorial.DoesNotExist):
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
        instance = self.get_object()
        serializer = ChangeAudioSerializer(instance, data=request.data)
        try:
            request.data['audio_chunk']
        except KeyError:
            instance.subtitle = request.data['subtitle']
            instance.save()
            return Response(status=status.HTTP_200_OK)

        if serializer.is_valid():
            serializer.save()
            new_audio_trim.delay(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RevertChunk(generics.UpdateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated, IsContributor]
    serializer_class = ChangeAudioSerializer

    def update(self, request, *args, **kwargs):
        try:
            history_id = self.kwargs['history_id']

            chunk = VideoChunk.objects.get(VideoTutorial=self.kwargs['pk'], chunk_no=self.kwargs['chunk_no'])

            latest_history_id = chunk.history.first().history_id
            print(latest_history_id)

            if int(latest_history_id) != int(history_id):
                revert_ver = chunk.history.get(history_id=history_id)
                revert_ver.instance.save()

                chunk = VideoChunk.objects.get(VideoTutorial=self.kwargs['pk'], chunk_no=self.kwargs['chunk_no'])
                serializer = ChangeAudioSerializer(chunk)
                new_audio_trim.delay(serializer.data)
                return Response(serializer.data, status=status.HTTP_200_OK)

            else:
                return Response({'details': 'Chunk already upto date'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class SubmitForReview(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated, IsContributor]

    def post(self, request, *args, **kwargs):
        try:
            pk = self.kwargs['pk']
            print(pk)
            video = VideoTutorial.objects.get(pk=pk, user=request.user)
            print(video.submission_status)
            if video.submission_status != 'submitted':
                video.submission_status = 'submitted'
                try:
                    video.comment = request.data['comment']
                except KeyError:
                    pass
                serializer = VideoSerializer(video)
                video.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'details': 'request already submitted'}, status=status.HTTP_409_CONFLICT)
        except:
            traceback.print_exc()
            return Response(status=status.HTTP_400_BAD_REQUEST)


# Domain Reviewer APIs


class DomainReviewerTutorialsList(generics.ListAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated, IsDomainReviewer]
    serializer_class = ReviewerTutorialSerializer

    def get_queryset(self):
        try:
            # user = self.request.user
            domains = DomainReviewerRole.objects.filter(user=self.request.user, status=True)
            tuts = None
            for domain in domains:
                print(domain)
                x = VideoTutorial.objects.filter(foss_id=domain.foss_category_id, language_id=domain.language_id,
                                                 status='done').exclude(submission_status='draft')
                if x.count():
                    if tuts is None:
                        tuts = x
                    else:
                        tuts = tuts | x
            return tuts

        except VideoTutorial.DoesNotExist:
            raise exceptions.NotFound('No Tutorials Found')

    # def get(self, request, *args, **kwargs):
    #     queryset = self.get_queryset()
    #     serializer = VideoSerializer(queryset, many=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)


class DomainReviewerTutorialInfo(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated, IsDomainReviewer]
    serializer_class = VideoChunkSerializer

    def get_queryset(self):
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
            if is_foss_allotted(request.user, video_obj.foss, video_obj.language):
                chunk = VideoChunk.objects.filter(VideoTutorial=pk)
                context = {'request': request}

                ser_video = VideoSerializer(video_obj, context=context)

                meta_data = ser_video.data
                meta_data['tutorial_name'] = str(TutorialDetail.objects.get(pk=video_obj.tutorial_detail.pk))
                meta_data['language'] = str(Language.objects.get(pk=video_obj.language.pk))
                meta_data['foss'] = video_obj.tutorial_detail.foss.foss

                ser_chunk = VideoChunkSerializer(chunk, many=True, context=context)

                return Response({
                    'video_data': meta_data,
                    'chunks': ser_chunk.data})
        except (ValidationError, VideoTutorial.DoesNotExist):
            return Response(
                {"details": 'error'},
                status=status.HTTP_400_BAD_REQUEST)


class SingleChunk(generics.RetrieveAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated, IsDomainReviewer]
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


class SetVerdict(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated, IsDomainReviewer]

    def post(self, request, *args, **kwargs):
        try:
            video_id = self.kwargs['pk']
            video_obj = VideoTutorial.objects.get(pk=video_id)
            if is_foss_allotted(request.user, video_obj.foss, video_obj.language):
                if request.data['verdict'] == 'accepted' or request.data['verdict'] == 'rejected':
                    video_obj.submission_status = request.data['verdict']
                    try:
                        video_obj.comment = request.data['comment']
                    except IndexError:
                        pass
                    except KeyError:
                        pass
                    video_obj.save()
                    serializer = VideoSerializer(video_obj)
                    return Response(serializer.data, status=status.HTTP_200_OK)
        except IndexError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
