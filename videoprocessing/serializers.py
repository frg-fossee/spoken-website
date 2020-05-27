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


class TutorialDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorialDetail
        fields = ('id', 'tutorial',)


class ContributorTutorialsSerializer(serializers.ModelSerializer):
    """
    Serializer to list all the tutorials alloted to a particular contributor
    """
    foss_category = FossCategorySerializer(read_only=True)
    language = LanguageSerializer(read_only=True)
    tutorial_detail = TutorialDetailSerializer(read_only=True)

    class Meta:
        model = ContributorRole
        fields = ('foss_category', 'tutorial_detail', 'language')


class VideoSerializer(serializers.ModelSerializer):
    """Serializer for Single Video Submission"""

    class Meta:
        model = VideoTutorial
        fields = ['id', 'checksum', 'status', 'tutorial_detail', 'language',
                  'video', 'subtitle', 'total_chunks', 'processed_video']
        read_only_fields = ['id', 'checksum', 'status',
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


class VideoChunkHistory(serializers.ModelSerializer):
    """Serializer to list all the revisions of a video chunk"""

    def __init__(self, model, *args, fields='__all__', **kwargs):
        self.Meta.model = model
        self.Meta.fields = fields
        super().__init__()

    class Meta:
        pass


class ChangeAudioSerializer(serializers.ModelSerializer):
    """Serializer to upload new audio for a particular chunk"""
    history = serializers.SerializerMethodField()

    def get_history(self, obj):
        model = obj.history.__dict__['model']
        fields = ['history_id', 'history_date', 'subtitle', 'audio_chunk', ]
        serializer = VideoChunkHistory(model, obj.history.all().order_by('-history_date'), fields=fields, many=True)
        serializer.is_valid()
        print(serializer.data)
        return serializer.data

    class Meta:
        model = VideoChunk
        fields = [
            'chunk_no',
            'audio_chunk',
            'start_time',
            'end_time',
            'subtitle',
            'VideoTutorial',
            'history'
        ]
        read_only_fields = [
            'chunk_no',
            'start_time',
            'end_time',
            'VideoTutorial',
            'history'
        ]
