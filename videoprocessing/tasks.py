import os
import re
import time
from datetime import datetime
from hashlib import md5
from shutil import copy2

import pysrt
from celery import shared_task
from django.conf import settings

from videoprocessing.models import VideoTutorial, VideoChunk

VIDEO_FILE_NAME = 'video'
SUBTITLE_FILE_NAME = 'subtitle'
CHUNKS_DIRECTORY = 'chunks'
AUDIO_FILE_NAME = 'audio'
VIDEO_WITHOUT_AUDIO_FILE_NAME = 'no_audio'
PROCESSED_VIDEO_PREFIX = 'processed_video'
VIDEO_FILE_EXTENSION = '.mp4'
AUDIO_FILE_EXTENSION = '.mp3'
SUBTITLE_FILE_EXTENSION = '.srt'
CHUNKS_LIST_FILE_NAME = 'compiled_video_list.txt'

AUDIO_SAMPLE_RATE = '44100'
AUDIO_BIT_RATE = '99k'


def repl(m):
    return m.group() + ',000'


@shared_task()
def copy_video_generate_checksum(video_id, file_path):
    """
    copy the original video and subtitle file
    if exits checksum will be generated
    """
    try:
        folder_path = os.path.join(settings.MEDIA_ROOT, settings.VIDEO_PROCESSING_ROOT, video_id)
        os.mkdir(folder_path)
        os.chdir(folder_path)
        source = file_path
        dest = settings.MEDIA_ROOT + settings.VIDEO_PROCESSING_ROOT + "/" + video_id

        copy2(source + VIDEO_FILE_EXTENSION, dest + '/' + VIDEO_FILE_NAME + VIDEO_FILE_EXTENSION)
        copy2(source + SUBTITLE_FILE_EXTENSION, dest + '/' + SUBTITLE_FILE_NAME + SUBTITLE_FILE_EXTENSION)

        checksum = str(
            md5(open(os.path.join(folder_path, VIDEO_FILE_NAME + VIDEO_FILE_EXTENSION), 'rb').read()).hexdigest())

        VideoTutorial.objects.filter(pk=video_id).update(
            video=os.path.join(settings.VIDEO_PROCESSING_ROOT, video_id, VIDEO_FILE_NAME + VIDEO_FILE_EXTENSION),
            subtitle=os.path.join(settings.VIDEO_PROCESSING_ROOT, video_id,
                                  SUBTITLE_FILE_NAME + SUBTITLE_FILE_EXTENSION),
            processed_video=os.path.join(settings.VIDEO_PROCESSING_ROOT, video_id,
                                         VIDEO_FILE_NAME + VIDEO_FILE_EXTENSION),
            checksum=checksum
        )
        process_video.delay(video_id)
    except FileNotFoundError:
        VideoTutorial.objects.filter(pk=video_id).update(
            status='subtitle_not_found'
        )


@shared_task
def process_video(video_id):
    """
    this function will break the uploaded video into
    chunks and will store audio separately
    """
    folder_path = os.path.join(settings.MEDIA_ROOT, settings.VIDEO_PROCESSING_ROOT, video_id)
    os.chdir(folder_path)
    os.system(
        'ffmpeg -i ' +
        VIDEO_FILE_NAME + VIDEO_FILE_EXTENSION +
        ' -c copy -an ' +
        VIDEO_WITHOUT_AUDIO_FILE_NAME + VIDEO_FILE_EXTENSION)
    os.system(
        'ffmpeg -i ' +
        VIDEO_FILE_NAME + VIDEO_FILE_EXTENSION +
        ' -ab ' + AUDIO_BIT_RATE +
        ' -ar ' + AUDIO_SAMPLE_RATE +
        ' -vn ' +
        AUDIO_FILE_NAME + AUDIO_FILE_EXTENSION)
    chunk_directory = os.path.join(folder_path, CHUNKS_DIRECTORY)
    os.mkdir(chunk_directory)
    fp = open(SUBTITLE_FILE_NAME + SUBTITLE_FILE_EXTENSION, 'r')
    temp = str(fp.read())
    x = re.sub(r'[0-9][0-9]:[0-5][0-9]:[0-5][0-9](?!,)', repl, temp)
    fp.close()
    fp = open(SUBTITLE_FILE_NAME + SUBTITLE_FILE_EXTENSION, 'w')
    fp.write(x)
    fp.close()
    compile_video_list = open(CHUNKS_DIRECTORY + '/' + CHUNKS_LIST_FILE_NAME, 'w+')
    temp = open(CHUNKS_DIRECTORY + '/' + 'temp.txt', 'w+')

    subs = pysrt.open(SUBTITLE_FILE_NAME + SUBTITLE_FILE_EXTENSION, encoding='iso-8859-1')
    VideoTutorial.objects.filter(pk=video_id).update(total_chunks=len(subs))

    for i in range(len(subs)):
        sub_text = str(subs[i].text)
        start_time = str(subs[i].start).replace(',', '.')
        end_time = str(subs[i].end).replace(',', '.')
        nos_audio_file_name = chunk_directory + "/" + 'h_' + str(i) + AUDIO_FILE_EXTENSION

        # for the first video without subtitle
        if (i == 0) and (start_time != '00:00:00.000'):
            command = str(
                "ffmpeg -i " +
                AUDIO_FILE_NAME + AUDIO_FILE_EXTENSION +
                " -ss 00:00:00.000 " +
                " -to " + start_time +
                " -c copy " + nos_audio_file_name)
            os.system(command)
            compile_video_list.write("file '" + 'h_' + str(i) + AUDIO_FILE_EXTENSION + "'\n")
            temp.write("file '" + 'h_' + str(i) + AUDIO_FILE_EXTENSION + '00:00:00.000' + " => " + start_time + "'\n")

        if i != 0:
            nos_start_time = str(subs[i - 1].end).replace(',', '.')
            nos_end_time = str(subs[i].start).replace(',', '.')
            if nos_start_time != nos_end_time:
                command = str("ffmpeg -i " +
                              AUDIO_FILE_NAME + AUDIO_FILE_EXTENSION +
                              " -ss " +
                              nos_start_time +
                              " -to " + nos_end_time +
                              " -c copy " +
                              nos_audio_file_name)
                os.system(command)
                compile_video_list.write("file '" + 'h_' + str(i) + AUDIO_FILE_EXTENSION + "'\n")
                temp.write(
                    "file '" + 'h_' + str(i) + AUDIO_FILE_EXTENSION + nos_start_time + " => " + nos_end_time + "'\n")

        audio_file_name = chunk_directory + "/" + str(i) + AUDIO_FILE_EXTENSION
        command = str("ffmpeg -i " +
                      AUDIO_FILE_NAME + AUDIO_FILE_EXTENSION +
                      " -ss " +
                      start_time +
                      " -to " + end_time + " -c copy " + audio_file_name)
        os.system(command)
        compile_video_list.write("file '" + str(i) + AUDIO_FILE_EXTENSION + "'\n")
        temp.write("file '" + str(i) + AUDIO_FILE_EXTENSION + start_time + " => " + end_time + "'\n")

        VideoChunk.objects.create(
            chunk_no=i,
            VideoTutorial=VideoTutorial.objects.get(id=video_id),
            audio_chunk=os.path.join(settings.VIDEO_PROCESSING_ROOT, video_id, CHUNKS_DIRECTORY,
                                     str(i) + AUDIO_FILE_EXTENSION),
            start_time=start_time,
            end_time=end_time,
            subtitle=sub_text
        )

        if i == len(subs) - 1:
            nos_audio_file_name = chunk_directory + "/" + 'h_' + str(i + 1) + AUDIO_FILE_EXTENSION
            command = str(
                "ffmpeg -i " +
                AUDIO_FILE_NAME + AUDIO_FILE_EXTENSION +
                " -ss " + end_time +
                " -c copy " + nos_audio_file_name)
            os.system(command)
            compile_video_list.write("file '" + 'h_' + str(i + 1) + AUDIO_FILE_EXTENSION + "'\n")
            temp.write("file '" + 'final.mp3' + end_time + "'\n")

    compile_video_list.close()
    temp.close()

    compile_all_chunks(video_id)


@shared_task
def new_audio_trim(chunk):
    chunk_file = str(chunk['chunk_no']) + AUDIO_FILE_EXTENSION
    video_id = chunk['VideoTutorial']
    start_time = chunk['start_time']
    end_time = chunk['end_time']
    time_format = '%H:%M:%S'

    VideoTutorial.objects.filter(pk=video_id).update(status='in_queue')

    diff = datetime.strptime(end_time, time_format) - datetime.strptime(start_time, time_format)

    folder_path = os.path.join(settings.MEDIA_ROOT, settings.VIDEO_PROCESSING_ROOT, video_id)
    chunk_directory = os.path.join(folder_path, CHUNKS_DIRECTORY)
    os.chdir(chunk_directory)
    os.rename(chunk_file, 'temp.mp3')
    os.system('ffmpeg -i temp.mp3 ' +
              '-ab ' + AUDIO_BIT_RATE +
              ' -ar ' + AUDIO_SAMPLE_RATE +
              ' temp1.mp3 ')
    # getting the length of audio
    audio_length_format = '%H:%M:%S.%f'
    audio_length_str = str(os.popen(
        "ffprobe -v error -sexagesimal -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 temp1.mp3") \
                           .read())
    audio_length_str = audio_length_str.rstrip()
    audio_start_time = start_time + '.000000'
    audio_end_time = end_time + '.000000'
    audio_len = datetime.strptime(audio_length_str, audio_length_format) - datetime.strptime("00:00:00.000000",
                                                                                             audio_length_format)
    audio_diff = datetime.strptime(audio_end_time, audio_length_format) - datetime.strptime(audio_start_time,
                                                                                            audio_length_format)
    if audio_len < audio_diff:
        # add some silence
        abs_diff = str(abs(audio_diff - audio_len))
        os.system(
            "ffmpeg -f lavfi -i anullsrc=sample_rate=48000 -ab " + AUDIO_BIT_RATE + " -t " + abs_diff + " silence.mp3")
        os.system('ffmpeg -y -i "concat:temp1.mp3|silence.mp3" -acodec copy temp2.mp3')
        command = str("ffmpeg -y -i temp2.mp3 -ss 00:00:00.000 " +
                      " -to " + str(diff) +
                      " -c copy " + chunk_file)

    else:
        command = str("ffmpeg -y -i temp1.mp3 -ss 00:00:00.000 " +
                      " -to " + str(diff) +
                      " -c copy " + chunk_file)
    os.system(command)
    os.remove('temp.mp3')
    os.remove('temp1.mp3')
    if os.path.exists('temp2.mp3'):
        os.remove('temp2.mp3')

    compile_all_chunks(video_id)


@shared_task()
def compile_all_chunks(video_id):
    """Combine all the chunks and return a processed video"""
    folder_path = os.path.join(settings.MEDIA_ROOT, settings.VIDEO_PROCESSING_ROOT, video_id)
    chunk_directory = os.path.join(folder_path, CHUNKS_DIRECTORY)
    os.chdir(chunk_directory)
    timestamp = str(time.strftime("%Y%m%d-%H%M%S"))
    audio_filename = PROCESSED_VIDEO_PREFIX + timestamp + AUDIO_FILE_EXTENSION
    video_filename = PROCESSED_VIDEO_PREFIX + timestamp + VIDEO_FILE_EXTENSION

    command = 'ffmpeg -y -f concat -safe 0 -i ' + \
              CHUNKS_LIST_FILE_NAME + \
              ' ' + audio_filename

    os.system(command)

    command = 'ffmpeg -y -i ../' + \
              VIDEO_WITHOUT_AUDIO_FILE_NAME + VIDEO_FILE_EXTENSION + \
              ' -i ' + audio_filename + ' -c copy ' + video_filename
    os.system(command)

    file_path = os.path.join(settings.VIDEO_PROCESSING_ROOT, video_id, CHUNKS_DIRECTORY, video_filename)
    VideoTutorial.objects.filter(pk=video_id). \
        update(status='done', processed_video=file_path)