import hashlib
import os
import uuid
from functools import partial

from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from rest_framework.exceptions import ValidationError
from simple_history.models import HistoricalRecords
from django.utils import timezone
from creation.models import TutorialDetail, Language, FossCategory


def hash_file(file, block_size=65536):
    hasher = hashlib.md5()
    for buf in iter(partial(file.read, block_size), b''):
        hasher.update(buf)

    return hasher.hexdigest()


def get_video_path(instance, filename):
    """
    Get path of uploaded video file
    the video file will be stored in "videoprocessing/project_id/video.mp4" in media directory
    """
    if not instance.pk:
        create_with_pk(instance)
    uid = str(instance.pk)
    ext = filename.split('.')[-1]
    return os.path.join(settings.VIDEO_PROCESSING_ROOT, uid, settings.VIDEO_PROCESSING_VIDEO_FILE_NAME + '.' + ext)


def get_subtitle_path(instance, filename):
    """
    Get path of uploaded video file
    the video file will be stored in "videoprocessing/project_id/subtitle.mp4"
    in media directory
    """
    if not instance.pk:
        create_with_pk(instance)
    uid = str(instance.pk)
    ext = filename.split('.')[-1]
    return os.path.join(settings.VIDEO_PROCESSING_ROOT, uid, settings.VIDEO_PROCESSING_SUBTITLE_FILE_NAME + '.' + ext)


def create_with_pk(self):
    """create the Video Submission Object if not created initially"""
    instance = self.create()
    instance.save()
    return instance


def validate_video(value):
    """Checking if the uploaded video has .mp4 extension"""
    ext = os.path.splitext(value.name)[1]  # [0] returns path+filename
    valid_extensions = ['.mp4', '.ogv']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension.')


def validate_subtitle(value):
    """Checking if the uploaded subtitle has .srt extension"""
    ext = os.path.splitext(value.name)[1]  # [0] returns path+filename
    valid_extensions = ['.srt']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension.')


def validate_audio(value):
    """Checking if the uploaded audio has .mp3 extension and it don't exist"""
    ext = os.path.splitext(value.name)[1]  # [0] returns path+filename
    valid_extensions = ['.mp3', '.webm']

    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension.')


def get_video_chunk_path(instance, filename):
    """
    Get path to store video chunk
    the path will be of format : videoprocessing/project_id/chunks/chunk_no.mp4
    """

    if (not instance.project_id) and (not instance.chunk_no):
        raise ValidationError('Invalid Project ID')
    ext = '.' + filename.split('.')[-1]

    return os.path.join(settings.VIDEO_PROCESSING_ROOT, instance.project_id + '/chunks/', instance.chunk_no + ext)


def get_audio_chunk_path(instance, filename):
    """
    Get path to store audio chunk
    the path will be of format : videoprcessing/project_id/chunks/chunk_no.mp3
    """
    if (not instance.VideoTutorial.id) and (not instance.chunk_no):
        raise ValidationError('Invalid Project ID')

    audio_ext = '.' + filename.split('.')[-1]

    instance.audio_chunk.open()

    new_file_name = str(instance.chunk_no) + '_' + hash_file(instance.audio_chunk) + audio_ext
    new_file_path = os.path.join(settings.VIDEO_PROCESSING_ROOT, str(instance.VideoTutorial.id) + '/chunks/',
                                 new_file_name)

    print(os.path.exists(os.path.join(settings.MEDIA_ROOT, new_file_path)))
    if os.path.exists(os.path.join(settings.MEDIA_ROOT, new_file_path)):
        raise ValidationError({'details': 'File Already Exist'})

    return new_file_path


# Models
class VideoTutorial(models.Model):
    """
    This model holds video and subtitle uploaded by user
    after uploading, a project id will be allotted.
    """
    id = models.UUIDField(primary_key=True,
                          default=uuid.uuid4,
                          editable=False)
    checksum = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    foss = models.ForeignKey(FossCategory, null=True)
    tutorial_detail = models.ForeignKey(TutorialDetail)
    language = models.ForeignKey(Language)
    status = models.CharField(default='in_queue', max_length=32)
    video = models.FileField(upload_to=get_video_path,
                             validators=[validate_video])
    subtitle = models.FileField(upload_to=get_subtitle_path,
                                validators=[validate_subtitle])
    total_chunks = models.SmallIntegerField(default=0)
    processed_video = models.FileField()
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    SUBMISSION_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ]
    submission_status = models.CharField(max_length=9, choices=SUBMISSION_STATUS_CHOICES, default='draft')
    comment = models.TextField(null=True, blank=True)

    def __str__(self):
        return str(self.tutorial_detail)


class VideoChunk(models.Model):
    """
    This model hold processed video chunk
    It has many-to-one relationship with VideoTutorial Object
    """
    chunk_no = models.SmallIntegerField()
    VideoTutorial = models.ForeignKey(VideoTutorial,
                                      on_delete=models.CASCADE)
    # video_chunk = models.FileField()
    audio_chunk = models.FileField(upload_to=get_audio_chunk_path,
                                   validators=[validate_audio])
    start_time = models.TimeField()
    end_time = models.TimeField()
    subtitle = models.TextField()
    history = HistoricalRecords()
