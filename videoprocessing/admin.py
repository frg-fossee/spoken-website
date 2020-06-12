from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from videoprocessing.models import VideoTutorial, VideoChunk


class VideoChunkAdmin(SimpleHistoryAdmin):
    list_display = ["chunk_no", "VideoTutorial", "subtitle"]
    search_fields = ["VideoTutorial", "subtitle"]


class VideoTutorialAdmin(admin.ModelAdmin):
    list_display = ["foss", "tutorial_detail", "submission_status", "language", "created_at", "updated_at"]
    search_fields = ["language__name", "foss__foss", 'tutorial_detai']
    list_filter = ('submission_status', 'foss', 'language', 'tutorial_detail')


# Register your models here.
admin.site.register(VideoTutorial, VideoTutorialAdmin)
admin.site.register(VideoChunk, VideoChunkAdmin)
