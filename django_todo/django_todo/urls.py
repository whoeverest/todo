from django.conf.urls import patterns, include, url
from rest_framework import routers
from rest import views

router = routers.DefaultRouter()
router.register(r'todos', views.TodoViewSet)
# router.register(r'groups', views.GroupViewSet)

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'django_todo.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)
