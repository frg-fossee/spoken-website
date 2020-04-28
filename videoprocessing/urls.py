from django.conf.urls import url
from videoprocessing import views
urlpatterns = [
    url(r'api/tutorials', views.ContributorTutorialsList.as_view()),
    url(r'', views.index, name='home')
]
