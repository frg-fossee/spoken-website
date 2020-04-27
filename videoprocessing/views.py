from rest_framework import generics
from rest_framework.response import Response

from creation.models import ContributorRole
from videoprocessing.serializers import ContributorTutorialsSerializer


class ContributorTutorialList(generics.ListAPIView):
    def get_queryset(self):
        return ContributorRole.objects.filter(user=self.request.user, status=True)

    def get(self, request):
        categories = ContributorTutorialsSerializer(self.get_queryset(), many=True).data

        unique_categories = {}
        res = []

        for category in categories:
            category_id = category['foss_category']['id']

            if category_id not in unique_categories:
                foss_category = category['foss_category']
                unique_categories[category_id] = {
                    'foss_category': {
                        'id': foss_category['id'],
                        'name': foss_category['name'],
                        'description': foss_category['description']
                    },
                    'languages': []
                }

            unique_categories[category_id]['languages'].append(category['language'])

        for (k, v) in unique_categories.items():
            res.append(v)

        return Response({'data': res}, status=200)
