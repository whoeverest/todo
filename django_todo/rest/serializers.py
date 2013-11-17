# from django.contrib.auth.models import User, Group
from rest.models import Todo
from rest_framework import serializers

# class UserSerializer(serializers.HyperlinkedModelSerializer):
# 	class Meta:
# 		model = User
# 		fields = ('url', 'username', 'email', 'groups')

# class GroupSerializer(serializers.HyperlinkedModelSerializer):
# 	class Meta:
# 		model = Group
# 		fields = ('url', 'name')

class TodoSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Todo
		fields = ('text', 'priority', 'due_date', 'completed')