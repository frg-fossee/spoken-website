import os
import re
import time
from datetime import datetime

import pysrt
from celery import shared_task
from django.conf import settings

from videoprocessing.models import VideoTutorial, VideoChunk


def repl(m):
    return m.group() + ',000'


@shared_task
def process_video(video_id, file_path):
    """
    this function will break the uploaded video into
    chunks and will store audio separately
    """
    print(file_path)
    folder_path = os.path.join(settings.MEDIA_ROOT, settings.VIDEO_PROCESSING_ROOT, video_id)
    print(str(folder_path))
    os.mkdir(folder_path)
    os.chdir(folder_path)
    os.system('pwd')
    print("cp " + file_path + '.mp4 ' + settings.MEDIA_ROOT + "videoprocessing/" + video_id + '/video.mp4')
    os.system("cp " + file_path + '.mp4 ' + settings.MEDIA_ROOT + "videoprocessing/" + video_id + '/video.mp4')
    os.system("cp " + file_path + '.srt ' + str(folder_path) + "/subtitle.srt")
    VideoTutorial.objects.filter(pk=video_id).update(
        video=os.path.join("videoprocessing", video_id, 'video.mp4'),
        subtitle=os.path.join("videoprocessing", video_id, 'subititle.srt'),
        processed_video=os.path.join("videoprocessing", video_id, 'video.mp4')
    )

    chunk_directory = os.path.join(folder_path, 'chunks')
    os.mkdir(chunk_directory)
    fp = open('subtitle.srt', 'r')
    temp = str(fp.read())
    x = re.sub("[0-9][0-9]:[0-5][0-9]:[0-5][0-9](?!,)", repl, temp)
    fp.close()
    fp = open('subtitle.srt', 'w')
    fp.write(x)
    fp.close()
    compile_video_list = open('chunks/compiled_video_list.txt', 'w+')
    subs = pysrt.open('subtitle.srt', encoding='iso-8859-1')
    VideoTutorial.objects.filter(pk=video_id).update(total_chunks=len(subs))

    os.system('ffmpeg -i video.mp4 -c copy -an nosound.mp4')
    os.system('ffmpeg -i video.mp4 -ab 160k -ac 2 -ar 44100 -vn music.mp3')
    for i in range(len(subs)):
        sub_text = str(subs[i].text)
        start_time = str(subs[i].start).replace(',', '.')
        end_time = str(subs[i].end).replace(',', '.')
        nos_audio_file_name = chunk_directory + "/" + 'h_' + str(i) + '.mp3'

        # for the first video without subtitle
        if (i == 0) and (start_time != '00:00:00.000'):
            command = str(
                "ffmpeg -hide_banner -loglevel warning -i music.mp3 -ss 00:00:00.000 " +
                " -to " + start_time +
                " -c copy " + nos_audio_file_name)
            os.system(command)
            compile_video_list.write("file '" + 'h_' + str(i) + '.mp3' + "'\n")

        if (i != len(subs) - 1) and (i != 0):
            nos_start_time = str(subs[i].end).replace(',', '.')
            nos_end_time = str(subs[i + 1].start).replace(',', '.')
            if nos_start_time != nos_end_time:
                command = str("ffmpeg -hide_banner -loglevel warning -i music.mp3 -ss " +
                              nos_start_time +
                              " -to " + nos_end_time +
                              " -c copy " +
                              nos_audio_file_name)
                os.system(command)
                compile_video_list.write("file '" + 'h_' + str(i) + '.mp3' + "'\n")

        audio_file_name = chunk_directory + "/" + str(i) + '.mp3'
        command = str("ffmpeg -hide_banner -loglevel warning -i music.mp3 -ss " +
                      start_time +
                      " -to " + end_time + " -c copy " + audio_file_name)
        os.system(command)
        compile_video_list.write("file '" + str(i) + '.mp3' + "'\n")

        VideoChunk.objects.create(
            chunk_no=i,
            VideoTutorial=VideoTutorial.objects.get(id=video_id),
            audio_chunk=os.path.join("videoprocessing/" + video_id, 'chunks', str(i) + '.mp3'),
            start_time=start_time,
            end_time=end_time,
            subtitle=sub_text
        )

        if i == len(subs) - 1:
            command = str(
                "ffmpeg -hide_banner -loglevel warning  -i music.mp3 -ss " + end_time +
                " -c copy " + nos_audio_file_name)
            os.system(command)
            compile_video_list.write("file '" + 'h_' + str(i) + '.mp3' + "'\n")
    compile_video_list.close()

    compile_all_chunks(video_id)


@shared_task
def new_audio_trim(chunk):
    chunk_file = str(chunk['chunk_no']) + '.mp3'
    video_id = chunk['VideoSubmission']
    start_time = chunk['start_time']
    end_time = chunk['end_time']
    time_format = '%H:%M:%S'

    VideoTutorial.objects.filter(pk=video_id).update(status='in_queue')

    diff = datetime.strptime(end_time, time_format) - datetime.strptime(start_time, time_format)

    folder_path = os.path.join(settings.MEDIA_ROOT, settings.VIDEO_PROCESSING_ROOT, video_id)
    chunk_directory = os.path.join(folder_path, 'chunks')
    os.chdir(chunk_directory)
    os.rename(chunk_file, 'temp.mp3')
    os.system('ffmpeg -hide_banner -loglevel warning -i temp.mp3 -ab 160k -ac 2 -ar 44100 temp1.mp3')
    command = str("ffmpeg -hide_banner -loglevel warning -y -i temp1.mp3 -ss 00:00:00.000 " +
                  " -to " + str(diff) +
                  " -c copy " + chunk_file)
    os.system(command)
    os.remove('temp.mp3')
    os.remove('temp1.mp3')

    compile_all_chunks(video_id)


@shared_task()
def compile_all_chunks(video_id):
    """Combine all the chunks and return a processed video"""
    folder_path = os.path.join(settings.MEDIA_ROOT, settings.VIDEO_PROCESSING_ROOT, video_id)
    chunk_directory = os.path.join(folder_path, 'chunks')
    os.chdir(chunk_directory)
    timestamp = str(time.strftime("%Y%m%d-%H%M%S"))
    audio_filename = 'processed_audio' + timestamp + '.mp3'
    video_filename = 'processed_video' + timestamp + '.mp4'

    command = 'ffmpeg -hide_banner -loglevel warning -y -f concat -safe 0 -i ' \
              'compiled_video_list.txt -c copy ' + audio_filename

    os.system(command)

    command = 'ffmpeg -hide_banner -loglevel warning -y -i ../nosound.mp4 -i ' + audio_filename + ' -c copy -shortest ' + video_filename
    os.system(command)

    file_path = os.path.join("videoprocessing/" + video_id, 'chunks', video_filename)
    VideoTutorial.objects.filter(pk=video_id). \
        update(status='done', processed_video=file_path)
