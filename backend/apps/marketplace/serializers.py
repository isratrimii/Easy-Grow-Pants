from rest_framework import serializers
from .models import Plant, Order, OrderItem

class PlantSerializer(serializers.ModelSerializer):
    seller_username = serializers.CharField(source='seller.username', read_only=True)

    class Meta:
        model = Plant
        fields = '__all__'
        read_only_fields = ('seller',)

class OrderItemSerializer(serializers.ModelSerializer):
    plant_name = serializers.CharField(source='plant.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'plant', 'plant_name', 'quantity', 'price')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('user', 'total_price', 'status', 'tracking_id')

class CreateOrderSerializer(serializers.Serializer):
    items = serializers.ListField(
        child=serializers.DictField(child=serializers.IntegerField())
    )
    # Expected input: items: [{plant_id: 1, quantity: 2}, ...]
