from rest_framework import viewsets, permissions
from .models import Device, DeviceReading, ChatLog
from .serializers import DeviceSerializer, DeviceReadingSerializer, ChatLogSerializer

class DeviceViewSet(viewsets.ModelViewSet):
    serializer_class = DeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Device.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ChatLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ChatLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatLog.objects.filter(user=self.request.user)
