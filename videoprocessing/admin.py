from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from videoprocessing.models import VideoTutorial, VideoChunk


class VideoChunkAdmin(SimpleHistoryAdmin):
    list_display = ["chunk_no", "VideoTutorial", "subtitle"]
    search_fields = ["VideoTutorial", "subtitle"]


# Register your models here.
admin.site.register(VideoTutorial)
admin.site.register(VideoChunk, VideoChunkAdmin)
