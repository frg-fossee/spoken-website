from rest_framework import serializers

from creation.models import ContributorRole, FossCategory, Language, TutorialDetail


class FossCategorySerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='foss')

    class Meta:
        model = FossCategory
        fields = ('id', 'name', 'description')


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ('id', 'name')


class TutorialDetailSerialzer(serializers.ModelSerializer):
    class Meta:
        model = TutorialDetail
        fields = ('tutorial', 'pk')


class ContributorTutorialsSerializer(serializers.ModelSerializer):
    """
    Serializer to list all the tutorials alloted to a particular contributor
    """
    foss_category = FossCategorySerializer(read_only=True)
    language = LanguageSerializer(read_only=True)
    user = serializers.CharField()
    tutorial_detail = TutorialDetailSerialzer(read_only=True)

    class Meta:
        model = ContributorRole
        fields = ('foss_category', 'tutorial_detail', 'language', 'user',)
