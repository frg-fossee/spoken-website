from creation.models import ContributorRole


def is_contributor(foss, language, user):
    if ContributorRole.objects.filter(foss_category=foss.foss, language=language, user=user).exists():
        return True
    return False
