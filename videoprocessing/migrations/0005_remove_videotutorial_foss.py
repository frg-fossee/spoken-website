# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2020-05-04 07:00
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('videoprocessing', '0004_auto_20200504_1229'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='videotutorial',
            name='foss',
        ),
    ]
