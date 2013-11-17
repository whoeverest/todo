# from django.contrib.auth.models import User, Group
from rest.models import Todo
from rest_framework import viewsets
from rest.serializers import TodoSerializer

# class UserViewSet(viewsets.ModelViewSet):
# 	queryset = User.objects.all()
# 	serializer_class = UserSerializer

# class GroupViewSet(viewsets.ModelViewSet):
# 	queryset = Group.objects.all()
# 	serializer_class = GroupSerializer

class TodoViewSet(viewsets.ModelViewSet):
	queryset = Todo.objects.all()
	serializer_class = TodoSerializer

# Create your views here.
