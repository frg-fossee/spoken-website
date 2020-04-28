from django.shortcuts import render, redirect
from rest_framework import generics
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from creation.models import ContributorRole
from videoprocessing.serializers import ContributorTutorialsSerializer


def index(request):
    """
    The View which will load the frontend of App
    """
    if request.user.is_authenticated and ContributorRole.objects.filter(user=request.user).count():
        return render(request, 'videoprocessing/index.html')
    return redirect('%s?next=%s' % ('/accounts/login/', request.path))


# All the APIs

class ContributorTutorialsList(generics.ListAPIView):
    """
    This view should return a list of all the tutorials
    allotted to a particular contributor
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ContributorTutorialsSerializer

    def get_queryset(self):
        user = self.request.user
        return ContributorRole.objects.filter(user=user, status=True)
