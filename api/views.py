from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from creation.models import TutorialResource, TutorialDetail, FossSuperCategory, FossCategory
from api.serializers import VideoSerializer, CategorySerializer, FossSerializer
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count, F


@csrf_exempt
def video_list(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        snippets = TutorialResource.objects.filter(status=1, id=1)
        serializer = VideoSerializer(snippets, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = VideoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


@csrf_exempt
def get_tutorial_list(request, fossid, langid):
    """
    Retrieve, update or delete a code snippet.
    """

    try:
        tuts = TutorialResource.objects.filter(language_id=langid,
                tutorial_detail_id__foss=fossid, status=1)
    except ObjectDoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = VideoSerializer(tuts, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'PUT':

        data = JSONParser().parse(request)
        serializer = VideoSerializer(tut, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)
    elif request.method == 'DELETE':

        tut.delete()
        return HttpResponse(status=204)


def show_categories(request):
    """
    List all categories.
    """
    if request.method == 'GET':
        categories = FossSuperCategory.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return JsonResponse(serializer.data, safe=False)


def get_fosslist(request, catid):
    """
    Retrieve, fosslist based on category.
    """
    try:
        fosses = FossCategory.objects.filter(
            status=1, show_on_homepage=1, category=catid).values(
            'id','foss','description').annotate(tcount=Count('tutorialdetail'))
    except ObjectDoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = FossSerializer(fosses, many=True)
        return JsonResponse(serializer.data, safe=False)
