from django.db import models

# Create your models here.
class Todo(models.Model):
	text = models.CharField(max_length=1000)
	priority = models.IntegerField(default=2, choices=[(1,1), (2,2), (3, 3)])
	due_date = models.DateField(auto_now_add=True)
	completed = models.BooleanField(default=False)
