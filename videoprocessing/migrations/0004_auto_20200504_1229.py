# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2020-05-04 06:59
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('videoprocessing', '0003_auto_20200504_1225'),
    ]

    operations = [
        migrations.RenameField(
            model_name='videotutorial',
            old_name='tutorial',
            new_name='tutorial_detail',
        ),
    ]
