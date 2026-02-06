from rest_framework import serializers
from .models import Device, DeviceReading, ChatLog

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'
        read_only_fields = ('owner',)

class DeviceReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceReading
        fields = '__all__'

class ChatLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatLog
        fields = '__all__'
        read_only_fields = ('user',)
