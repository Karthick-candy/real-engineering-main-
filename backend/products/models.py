from django.db import models
from rest_framework import serializers
from django.utils import timezone

class Products(models.Model):
    # id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    category = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = '__all__'

from django.db import models

class ProductIDSequence(models.Model):
    id = models.AutoField(primary_key=True)
    current_id = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"Current ID: {self.current_id}"

    
class ServiceRequest(models.Model):
    name = models.CharField(max_length=100)
    company_name = models.CharField(max_length=100)
    address = models.CharField(max_length=300)
    phone_number = models.CharField(max_length=15)
    alternate_phone_number = models.CharField(max_length=15)
    machine_type = models.CharField(max_length=100)
    problem_description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'Service Request from {self.name} at {self.created_at}'

from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.user.username


class AdminIDSequence(models.Model):
    id = models.AutoField(primary_key=True)  # AutoField to automatically generate a unique ID
    current_id = models.PositiveIntegerField(default=1)  # Field to store the current available admin ID

    def __str__(self):
        return f"Current Admin ID: {self.current_id}"

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Profile
import re

class AdminRegistrationSerializer(serializers.ModelSerializer):
    confirmPassword = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone_number = serializers.CharField()

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirmPassword', 'first_name', 'last_name', 'phone_number']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError({"confirmPassword": "Passwords do not match"})
        validate_password(data['password'])
        
        phone_number = data.get('phone_number', '')
        if not re.match(r'^\+?1?\d{9,15}$', phone_number):
            raise serializers.ValidationError({"phone_number": "Invalid phone number"})
        
        return data

    def create(self, validated_data):
        validated_data.pop('confirmPassword')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        Profile.objects.create(user=user, phone_number=validated_data['phone_number'])
        return user


from rest_framework import serializers
from django.contrib.auth.models import User

class UpdateAdminSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(required = False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number']  # Exclude phone_number if not part of the User model

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()

        phone_number = validated_data.get('phone_number')
        if phone_number:
            profile = Profile.objects.get(user = instance)
            profile.phone_number = phone_number
            profile.save()
            
        return instance


from django.db import models

class SpringOrder(models.Model):
    user_name = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    product_name = models.CharField(max_length=255)
    company_address = models.CharField(max_length=255)
    company_phone = models.CharField(max_length=15)
    spring_size = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='open')  # "open" or "closed"

    def __str__(self):
        return self.product_name

class AccessoryOrder(models.Model):
    user_name = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    product_name = models.CharField(max_length=255)
    company_address = models.CharField(max_length=255)
    company_phone = models.CharField(max_length=15)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='open')  # "open" or "closed"

    def __str__(self):
        return self.product_name

class MachineryOrder(models.Model):
    user_name = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    product_name = models.CharField(max_length=255)
    company_address = models.CharField(max_length=255)
    company_phone = models.CharField(max_length=15)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='open')  # "open" or "closed"

    def __str__(self):
        return self.product_name

class SpringOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpringOrder
        fields = '__all__'

class AccessoryOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessoryOrder
        fields = '__all__'

class MachineryOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineryOrder
        fields = '__all__'




