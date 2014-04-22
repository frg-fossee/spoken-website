from django import forms
from django.core.validators import RegexValidator
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User
from django.db.models import Q

from creation.models import *

class ComponentForm(forms.Form):
    comp = forms.FileField(label = 'Select a file', required = True)
    comptype = forms.CharField(
        required = True,
        error_messages = {'required': 'component type is required.'},
        widget=forms.HiddenInput()
    )

    def clean(self):
        super(ComponentForm, self).clean()
        file_types = {
            'video': {'video/ogg'},
            'slide': {'application/zip'},
            'code': {'application/zip'},
            'assignment': {'text/plain', 'application/pdf'}
        }
        component = self.cleaned_data['comp']
        component_type = self.cleaned_data['comptype']
        print self.cleaned_data
        if component and component_type:
            if not component.content_type in file_types[component_type]:
                self._errors["comp"] = self.error_class(["Not a valid file format."])
        else:
            raise forms.ValidationError("Access Denied!")
        return component

    def __init__(self, comptype, *args, **kwargs):
        super(ComponentForm, self).__init__(*args, **kwargs)
        self.fields['comptype'].initial = comptype

class ContributorRoleForm(forms.ModelForm):
    user = forms.ModelChoiceField(
        cache_choices = True,
        queryset = User.objects.filter(Q(groups__name = 'Contributor')).order_by('username'),
        help_text = "",
        error_messages = {'required': 'User field required.'}
    )
    foss_category = forms.ModelChoiceField(
        cache_choices = True,
        queryset = Foss_Category.objects.order_by('foss'),
        empty_label = "----------",
        help_text = "",
        error_messages = {'required': 'FOSS category field required.'}
    )
    language = forms.ModelChoiceField(
        cache_choices =True,
        queryset = Language.objects.order_by('name'),
        empty_label = "----------",
        help_text = "",
        error_messages = {'required': 'Language field required.'}
    )
    status = forms.BooleanField(required = False)

    class Meta:
        model = Contributor_Role
        exclude = ['created', 'updated']

class DomainReviewerRoleForm(forms.ModelForm):
    user = forms.ModelChoiceField(
        cache_choices = True,
        queryset = User.objects.filter(Q(groups__name = 'Domain-Reviewer')).order_by('username'),
        help_text = "",
        error_messages = {'required': 'User field required.'}
    )
    foss_category = forms.ModelChoiceField(
        cache_choices = True,
        queryset = Foss_Category.objects.order_by('foss'),
        empty_label = "----------",
        help_text = "",
        error_messages = {'required': 'FOSS category field required.'}
    )
    language = forms.ModelChoiceField(
        cache_choices =True,
        queryset = Language.objects.order_by('name'),
        empty_label = "----------",
        help_text = "", error_messages = {'required': 'Language field required.'}
    )
    status = forms.BooleanField(required = False)

    class Meta:
        model = Domain_Reviewer_Role
        exclude = ['created', 'updated']

class QualityReviewerRoleForm(forms.ModelForm):
    user = forms.ModelChoiceField(
        cache_choices = True,
        queryset = User.objects.filter(Q(groups__name = 'Quality-Reviewer')).order_by('username'),
        help_text = "", error_messages = {'required': 'User field required.'}
    )
    foss_category = forms.ModelChoiceField(
        cache_choices = True,
        queryset = Foss_Category.objects.order_by('foss'),
        empty_label = "----------",
        help_text = "",
        error_messages = {'required': 'FOSS category field required.'}
    )
    language = forms.ModelChoiceField(
        cache_choices =True,
        queryset = Language.objects.order_by('name'),
        empty_label = "----------",
        help_text = "",
        error_messages = {'required': 'Language field required.'}
    )
    status = forms.BooleanField(required = False)

    class Meta:
        model = Quality_Reviewer_Role
        exclude = ['created', 'updated']

class UploadTutorialForm(forms.Form):
    tutorial_name = forms.ChoiceField(
        choices = [('', ''),],
        widget=forms.Select(attrs = {'disabled': 'disabled'}),
        required = True,
        error_messages = {'required': 'Tutorial Name field is required.'}
    )
    language = forms.ChoiceField(
        choices = [('', ''),],
        widget = forms.Select(attrs = {'disabled': 'disabled'}),
        required = True,
        error_messages = {'required': 'Language field is required.'}
    )
    def __init__(self, user, *args, **kwargs):
        super(UploadTutorialForm, self).__init__(*args, **kwargs)
        foss_list = list(
            Foss_Category.objects.filter(
                id__in = Contributor_Role.objects.filter(
                    user_id = user.id,
                    status = 1
                ).values_list(
                    'foss_category_id'
                )
            ).values_list('id', 'foss')
        )
        foss_list.insert(0, ('', ''))
        self.fields['foss_category'] = forms.ChoiceField(
            choices = foss_list,
            error_messages = {'required':'FOSS category field is required.'}
        )

        if args:
            if 'foss_category' in args[0]:
                if args[0]['foss_category'] and args[0]['foss_category'] != '' and args[0]['foss_category'] != 'None':
                    initial_data = ''
                    if args[0]['language'] and args[0]['language'] != '' and args[0]['language'] != 'None':
                        initial_data = args[0]['language']
                    choices = list(
                        Language.objects.filter(
                            id__in = Contributor_Role.objects.filter(
                                user_id = user.id,
                                foss_category_id = args[0]['foss_category']
                            ).values_list(
                                'language_id'
                            )
                        ).values_list(
                            'id',
                            'name'
                        )
                    )
                    choices.insert(0, ('', ''))
                    self.fields['language'].choices = choices
                    self.fields['language'].widget.attrs = {}
                    if initial_data:
                        self.fields['language'].initial = initial_data
                        lang_rec = Language.objects.get(pk = int(initial_data))
                        tut_init_data = ''
                        if args[0]['tutorial_name'] and args[0]['tutorial_name'] != '' and args[0]['tutorial_name'] != 'None':
                            tut_init_data = args[0]['tutorial_name']
                        if lang_rec.name == 'English':
                            td_list = Tutorial_Detail.objects.filter(foss_id = args[0]['foss_category']).values_list('id')
                            choices = list(Tutorial_Detail.objects.filter(
                                id__in = td_list
                            ).exclude(
                                id__in = Tutorial_Resource.objects.filter(
                                    tutorial_detail_id__in = td_list,
                                    language_id = lang_rec.id,
                                    status = 1
                                    ).values_list(
                                        'tutorial_detail_id'
                                    )
                            ).values_list('id', 'tutorial'))
                        else:
                            lang_rec = Language.objects.get(name = 'English')
                            td_list = Tutorial_Detail.objects.filter(foss_id = args[0]['foss_category']).values_list('id')
                            choices = list(Tutorial_Detail.objects.filter(
                                id__in = Tutorial_Resource.objects.filter(
                                    tutorial_detail_id__in = td_list,
                                    language_id = lang_rec.id,
                                    status = 1
                                ).values_list(
                                    'tutorial_detail_id'
                                )
                            ).values_list('id', 'tutorial'))
                        choices.insert(0, ('', ''))
                        self.fields['tutorial_name'].choices = choices
                        self.fields['tutorial_name'].widget.attrs = {}
                        self.fields['tutorial_name'].initial = tut_init_data
                    else:
                        self.fields['tutorial_name'].choices = ''
                        self.fields['tutorial_name'].widget.attrs = {'disabled': 'disabled'}

class UploadOutlineForm(forms.Form):
    outline = forms.CharField(
        widget = forms.Textarea,
        required = True,
        error_messages = {'required':'Outline field required'}
    )
    def __init__(self, trid, *args, **kwargs):
        super(UploadOutlineForm, self).__init__(*args, **kwargs)
        outline_rec = Tutorial_Resource.objects.get(pk = trid)
        if outline_rec.outline:
            print outline_rec.outline
            self.fields['outline'].initial = outline_rec.outline

class UploadScriptForm(forms.Form):
    scriptpath = forms.CharField(
        required = True,
        error_messages = {'required': 'script path is required'},
        widget=forms.HiddenInput()
    )
    def __init__(self, path, *args, **kwargs):
        super(UploadScriptForm, self).__init__(*args, **kwargs)
        self.fields['scriptpath'].initial = path

class ReviewVideoForm(forms.Form):
    video_status = forms.ChoiceField(
        choices = [('', '------'), (2, 'Accept'), (5, 'Need improvement')],
        required = True,
        error_messages = {'required': 'Please select the status'}
    )
    feedback = forms.CharField(
        widget = forms.Textarea,
        required = False
    )

class DomainReviewComponentForm(forms.Form):
    component_status = forms.ChoiceField(
        choices = [('', '------'), (3, 'Accept'), (5, 'Need improvement')],
        required = True,
        error_messages = {'required': 'Please select the status'}
    )
    feedback = forms.CharField(
        widget = forms.Textarea,
        required = False
    )
