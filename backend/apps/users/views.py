from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages
from rest_framework import generics, permissions
from .serializers import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

# API Views
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


# HTML Views
def login_view(request):
    """HTML login page"""
    # Redirect if already logged in
    if request.user.is_authenticated:
        return redirect('/dashboard/')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            # Redirect to next page or dashboard
            next_url = request.GET.get('next', '/dashboard/')
            return redirect(next_url)
        else:
            return render(request, 'login.html', {'error': 'Invalid username or password'})
    
    return render(request, 'login.html')


def register_view(request):
    """HTML registration page"""
    # Redirect if already logged in
    if request.user.is_authenticated:
        return redirect('/dashboard/')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        role = request.POST.get('role', 'buyer')
        phone = request.POST.get('phone', '')
        address = request.POST.get('address', '')
        
        # Validation
        if not username or not email or not password:
            return render(request, 'register.html', {'error': 'All required fields must be filled'})
        
        if password != password2:
            return render(request, 'register.html', {'error': 'Passwords do not match'})
        
        if len(password) < 8:
            return render(request, 'register.html', {'error': 'Password must be at least 8 characters long'})
        
        if User.objects.filter(username=username).exists():
            return render(request, 'register.html', {'error': 'Username already exists'})
        
        if User.objects.filter(email=email).exists():
            return render(request, 'register.html', {'error': 'Email already registered'})
        
        # Create user
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                role=role,
                phone=phone,
                address=address,
                green_points=10  # Welcome bonus
            )
            return render(request, 'register.html', {
                'success': 'Account created successfully! You received 10 welcome Green Points.'
            })
        except Exception as e:
            return render(request, 'register.html', {'error': f'Registration failed: {str(e)}'})
    
    return render(request, 'register.html')


def dashboard_view(request):
    """Enhanced dashboard with statistics"""
    if not request.user.is_authenticated:
        return redirect('/login/?next=/dashboard/')
    
    # Import models here to avoid circular imports
    from backend.apps.marketplace.models import Plant, Order
    from backend.apps.iot.models import Device
    
    # Get user statistics
    context = {
        'user': request.user,
        'user_plants_count': Plant.objects.filter(seller=request.user).count() if request.user.role == 'seller' else 0,
        'user_orders_count': Order.objects.filter(user=request.user).count(),
        'user_devices_count': Device.objects.filter(owner=request.user).count(),
    }
    
    return render(request, 'dashboard.html', context)
