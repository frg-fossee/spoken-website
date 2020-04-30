from django.conf.urls import url

from videoprocessing import views

urlpatterns = [
    url(r'api/tutorials', views.ContributorTutorialsList.as_view()),
    url(r'api/process_tutorials',
        views.VideoTutorialProcess.as_view()),
    url(r'api/chunks/(?P<pk>[0-9a-f-]+)', views.GetVideoChunk.as_view()),
    url(r'', views.index, name='home')
]
