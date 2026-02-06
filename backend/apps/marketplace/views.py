from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Plant, Order, OrderItem
from .serializers import PlantSerializer, OrderSerializer, CreateOrderSerializer

class IsSellerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in ['seller', 'admin']

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.seller == request.user or request.user.role == 'admin'

class PlantViewSet(viewsets.ModelViewSet):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer
    permission_classes = [IsSellerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'seller':
            # Sellers see orders containing their plants - complex query, simplifying for now to just created orders
            # Robust logic: Filter OrderItems where plant__seller=user
             return Order.objects.filter(items__plant__seller=user).distinct()
        elif user.role == 'admin':
             return Order.objects.all()
        return Order.objects.filter(user=user)

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if serializer.is_valid():
            items_data = serializer.validated_data['items']
            total_price = 0
            order = Order.objects.create(user=request.user, total_price=0)
            
            for item in items_data:
                plant_id = item.get('plant_id') or item.get('id') # Handle both
                quantity = item.get('quantity', 1)
                try:
                    plant = Plant.objects.get(id=plant_id)
                    price = plant.price * quantity
                    total_price += price
                    OrderItem.objects.create(order=order, plant=plant, quantity=quantity, price=plant.price)
                    # Update stock
                    plant.stock -= quantity
                    plant.save()
                except Plant.DoesNotExist:
                    continue
            
            order.total_price = total_price
            order.save()
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
