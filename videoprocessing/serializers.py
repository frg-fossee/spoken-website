from rest_framework import serializers

from creation.models import ContributorRole, FossCategory, Language, TutorialDetail
from videoprocessing.models import VideoTutorial, VideoChunk


class FossCategorySerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='foss')

    class Meta:
        model = FossCategory
        fields = ('id', 'name', 'description')


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ('id', 'name')


class TutorialDetailSerialzer(serializers.ModelSerializer):
    class Meta:
        model = TutorialDetail
        fields = ('tutorial', 'pk')


class ContributorTutorialsSerializer(serializers.ModelSerializer):
    """
    Serializer to list all the tutorials alloted to a particular contributor
    """
    foss_category = FossCategorySerializer(read_only=True)
    language = LanguageSerializer(read_only=True)
    user = serializers.CharField()
    tutorial_detail = TutorialDetailSerialzer(read_only=True)

    class Meta:
        model = ContributorRole
        fields = ('foss_category', 'tutorial_detail', 'language', 'user',)


class VideoSerializer(serializers.ModelSerializer):
    """Serializer for Single Video Submission"""

    class Meta:
        model = VideoTutorial
        fields = ['id', 'status', 'tutorial_detail', 'language',
                                                     'video', 'subtitle', 'total_chunks', 'processed_video']
        read_only_fields = ['id', 'status', 'tutorial_detail', 'language',
                                                               'video', 'subtitle', 'total_chunks', 'processed_video']


class VideoChunkSerializer(serializers.ModelSerializer):
    """Serializer to list all chunks of a particular project"""

    class Meta:
        model = VideoChunk
        fields = [
            'chunk_no',
            # 'video_chunk',
            'audio_chunk',
            'start_time',
            'end_time',
            'subtitle'
        ]


class ChangeAudioSerializer(serializers.ModelSerializer):
    """Serializer to upload new audio for a particular chunk"""
    audio_chunk = serializers.SerializerMethodField('get_audio_chunk')

    def get_audio_chunk(self, obj):
        return obj.audio_chunk.url

    class Meta:
        model = VideoChunk
        fields = [
            'chunk_no',
            # 'video_chunk',
            'audio_chunk',
            'start_time',
            'end_time',
            'subtitle',
            'VideoSubmission'
        ]
        read_only_fields = [
            'chunk_no',
            # 'video_chunk',
            'start_time',
            'end_time',
            'subtitle',
            'VideoSubmission'
        ]
