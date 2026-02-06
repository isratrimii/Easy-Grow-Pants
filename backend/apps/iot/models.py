from django.db import models
from django.conf import settings

class Device(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='devices')
    device_id = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    name = models.CharField(max_length=100, default="My Device")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.device_id})"

class DeviceReading(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='readings')
    soil_moisture = models.FloatField()
    temperature = models.FloatField()
    water_level = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reading for {self.device.device_id} at {self.timestamp}"

class ChatLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_logs')
    message = models.TextField()
    bot_response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat by {self.user.username} at {self.timestamp}"
