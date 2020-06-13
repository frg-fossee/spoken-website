FROM python:3.6-alpine

#Run python in unbuffered mode to allow for log messages to be
#immediately dumped to the stream instead of being buffered.
ENV PYTHONUNBUFFERED 1

RUN set -e; \
        apk add --no-cache --virtual .build-deps \
                gcc \
                libc-dev \
                linux-headers \
                mariadb-dev \
        ;

# Install all dependencies
RUN apk add curl-dev libressl-dev jpeg-dev zlib zlib-dev
RUN apk add libxml2 libxml2-dev libxslt libxslt-dev
COPY ./requirements-common.txt /requirements-common.txt
COPY ./requirements-dev.txt /requirements-dev.txt
COPY ./requirements-py3.txt /requirements-py3.txt
RUN pip install -r requirements-dev.txt
RUN pip install -r requirements-py3.txt
RUN apk add ffmpeg openssl-dev
RUN apk del .build-deps
RUN apk add --no-cache mariadb-connector-c-dev

# Copying app to docker and making it as working directory
RUN mkdir /app
WORKDIR /app
COPY . /app

# Directory which holds static assets
RUN mkdir -p /vol/web/media
RUN mkdir -p /vol/web/static

#Creating a user
RUN adduser -D user

#setting the folder permissions for static assets directory
RUN chown -R user:user /vol/
RUN chmod -R 755 /vol/web

#switching to user with limited permissions for better security
USER user

