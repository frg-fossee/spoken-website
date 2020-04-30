from rest_framework.permissions import BasePermission

from creation.models import ContributorRole


def is_tutorial_allotted(user, tutorial_id, language_id):
    """
    Checks if a particular tutorial is allotted to the Contributor
    """
    if ContributorRole.objects.filter(user=user, tutorial_detail_id=tutorial_id, language_id=language_id).count():
        return True
    return False


class IsContributor(BasePermission):
    """
    Allows access only to Contributor.
    """

    def has_permission(self, request, view):
        return ContributorRole.objects.filter(user=request.user).count()

    def has_object_permission(self, request, view, obj):
        return ContributorRole.objects.filter(user=request.user).count()
