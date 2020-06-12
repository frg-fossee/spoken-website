from django.conf.urls import url

from videoprocessing import views

urlpatterns = [
    url(r'api/tutorials', views.ContributorTutorialsList.as_view()),
    url(r'api/process_tutorials/(?P<pk>[0-9a-f-]+)/(?P<chunk_no>\d+)/revert/(?P<history_id>\d+)',
        views.RevertChunk.as_view()),
    url(r'api/process_tutorials/(?P<pk>[0-9a-f-]+)/(?P<chunk_no>\d+)', views.ChangeAudio.as_view()),
    url(r'api/process_tutorials/(?P<pk>[0-9a-f-]+)/submit', views.SubmitForReview.as_view()),
    url(r'api/process_tutorials/(?P<pk>[0-9a-f-]+)', views.GetVideoChunk.as_view()),
    url(r'api/process_tutorials',
        views.VideoTutorialProcess.as_view()),
    url(r'api/review/(?P<pk>[0-9a-f-]+)/(?P<chunk_no>\d+)', views.SingleChunk.as_view()),
    url(r'api/review/(?P<pk>[0-9a-f-]+)/verdict', views.SetVerdict.as_view()),
    url(r'api/review/(?P<pk>[0-9a-f-]+)', views.DomainReviewerTutorialInfo.as_view()),
    url(r'api/review', views.DomainReviewerTutorialsList.as_view()),
    url(r'', views.index, name='home')
]
