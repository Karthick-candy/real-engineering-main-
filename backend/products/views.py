from django.shortcuts import redirect
from django.http import JsonResponse
from urllib.parse import urlencode
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json

import jwt

from projectbackend import settings

from .models import ServiceRequest

@csrf_exempt
def generate_whatsapp_url(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            name = data.get('name')
            company_name = data.get('companyName')
            address = data.get('address')
            phone_number = data.get('phoneNumber')
            alternate_phone_number = data.get('alternatePhoneNumber')
            machine_type = data.get('machineType')
            problem_description = data.get('problemDescription')

            message = (
                f"A new service request is requested by:\n\n"
                f"Name: {name}\n"
                f"Company Name: {company_name}\n"
                f"Address: {address}\n"
                f"Phone Number: {phone_number}\n"
                f"Alternate Phone Number: {alternate_phone_number}\n"
                f"Machine Type: {machine_type}\n"
                f"Problem Description: {problem_description}"
            )

            # Construct the WhatsApp URL
            whatsapp_url = f"https://wa.me/9943295824?{urlencode({'text': message})}"

            # Return the WhatsApp URL
            return JsonResponse({'whatsapp_url': whatsapp_url})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


@csrf_exempt
def save_service_request(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            service_request = ServiceRequest(
                name=data['name'],
                company_name=data['companyName'],
                address=data['address'],
                phone_number=data['phoneNumber'],
                alternate_phone_number=data['alternatePhoneNumber'],
                machine_type=data['machineType'],
                problem_description=data['problemDescription'],
                created_at=timezone.now()
            )
            service_request.save()
            return JsonResponse({'status': 'success', 'message': 'Service request saved successfully'})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)
# products/views.py
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Profile, AdminIDSequence
from .models import AdminRegistrationSerializer
import pytz
from django.db import transaction

@api_view(['POST'])
def admin_registration(request):
    serializer = AdminRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        username = data['username']
        email = data['email']
        password = data['password']
        first_name = data['first_name']
        last_name = data['last_name']
        phone_number = data['phone_number']

        try:
            with transaction.atomic():
                # Fetch the current ID from AdminIDSequence
                id_sequence = AdminIDSequence.objects.get(id=1)
                new_id = id_sequence.current_id

                # Create the user with the fetched ID
                user = User(
                    id=new_id,  # Use the custom ID from AdminIDSequence
                    username=username,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    is_superuser=True,
                    is_staff=True,
                    is_active=True,
                    date_joined=timezone.now().astimezone(pytz.timezone('Asia/Kolkata')),
                    last_login=timezone.now().astimezone(pytz.timezone('Asia/Kolkata'))
                )
                user.set_password(password)  # Hash the password
                user.save()  # Save the user instance

                # Update the AdminIDSequence for the next user
                id_sequence.current_id += 1
                id_sequence.save()

                # Create or update the profile
                Profile.objects.update_or_create(
                    user=user,
                    defaults={'phone_number': phone_number}
                )

                return Response({'message': 'Admin registered successfully'}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            print(f"Error during admin registration: {e}")
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

class AdminLoginView(APIView):
    def post(self, request):
        email = request.data.get('admin_email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
            if user.check_password(password) and user.is_superuser:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
        except User.DoesNotExist:
            pass

        return Response({'error': 'Invalid credentials or not an admin.'}, status=status.HTTP_400_BAD_REQUEST)

# views.py
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class VerifyTokenView(APIView):
    def get(self, request):
        auth_header = request.headers.get('Authorization')
        if auth_header:
            token = auth_header.split(' ')[1]
            try:
                AccessToken(token)  # Validate the access token
                return Response({'message': 'Token is valid'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'error': 'Authorization header missing'}, status=status.HTTP_401_UNAUTHORIZED)

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Profile, AdminIDSequence
from django.db import transaction, connection

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_admins(request):
    if not request.user.is_superuser:
        return Response({'detail': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

    admins = User.objects.filter(is_superuser=True)
    data = []
    for admin in admins:
        profile = get_object_or_404(Profile, user=admin)
        data.append({
            'id': admin.id,
            'username': admin.username,
            'email': admin.email,
            'first_name': admin.first_name,
            'last_name': admin.last_name,
            'phone_number': profile.phone_number
        })

    return Response(data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_admin(request, pk):
    if not request.user.is_superuser:
        return Response({'detail': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

    try:
        # Fetch the user and profile in separate steps to handle exceptions better
        user = get_object_or_404(User, pk=pk)
        profile = get_object_or_404(Profile, user=user)

        # Print debug statements
        print(f"Attempting to delete profile for user: {user.username} (ID: {user.id})")
        
        # Delete the profile first
        profile.delete()
        print(f"Profile deleted for user: {user.username}.")

        # Now delete the user
        print(f"Now deleting user: {user.username}.")
        user.delete()

        # Reassign IDs after deletion
        print("Reassigning admin IDs...")
        reassign_admin_ids()

        return Response({'detail': 'Admin deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error deleting admin: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def reassign_admin_ids():
    try:
        with transaction.atomic():
            # Fetch all remaining admins ordered by their current ID
            with connection.cursor() as cursor:
                cursor.execute('SELECT id FROM auth_user WHERE is_superuser = true ORDER BY id')
                remaining_admins = cursor.fetchall()

            new_id = 1  # Start with ID 1
            for old_id, in remaining_admins:
                with connection.cursor() as cursor:
                    cursor.execute('UPDATE auth_user SET id = %s WHERE id = %s', [new_id, old_id])
                new_id += 1  # Increment the new ID

            # Update the ID sequence for the next admin
            id_sequence, created = AdminIDSequence.objects.get_or_create(id=1)
            id_sequence.current_id = new_id
            id_sequence.save()

    except Exception as e:
        print(f"Error reassigning admin IDs: {e}")
        raise


from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import UpdateAdminSerializer, Profile

class UpdateAdminView(APIView):
    def put(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            profile = Profile.objects.get(user=user)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UpdateAdminSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
                phone_number = request.data.get('phone_number')
                if phone_number:
                    profile.phone_number = phone_number
                    profile.save()
                return Response({'message': 'Admin updated successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Products, ProductSerializer, ProductIDSequence

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_products(request):
    if not request.user.is_superuser:
        return Response({'detail': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
     
    products = Products.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_product(request):
    if not request.user.is_superuser:
        return Response({'detail': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    # Get the product data from the request
    data = request.data

    # Handle file upload
    image = request.FILES.get('image')  # Get the uploaded image file

    # Fetch or create the ID sequence
    id_sequence, created = ProductIDSequence.objects.get_or_create(id=1)
    
    # Create the new product with the next available ID
    new_product = Products(
        id=id_sequence.current_id,
        name=data.get('name'),
        description=data.get('description'),
        price=data.get('price'),
        category=data.get('category'),
        image=image
    )
    new_product.save()

    # Update ID sequence
    id_sequence.current_id += 1
    id_sequence.save()

    return Response({'message': 'Product added successfully'}, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_product(request, pk):
    product = get_object_or_404(Products, pk=pk)
    serializer = ProductSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.db import transaction, connection
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, pk):
    if not request.user.is_superuser:
        return Response({'detail': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        with transaction.atomic():
            # Fetch the product by primary key (id)
            product = Products.objects.get(pk=pk)
            product.delete()  # Delete the product

            # Reassign IDs after deletion
            reassign_product_ids()

            return Response({'message': 'Product deleted and IDs reassigned successfully.'}, status=status.HTTP_204_NO_CONTENT)
    
    except Products.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error deleting product: {e}")
        return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def reassign_product_ids():
    try:
        with transaction.atomic():
            # Fetch all remaining products ordered by their current ID
            with connection.cursor() as cursor:
                cursor.execute('SELECT id FROM products_products ORDER BY id')
                remaining_products = cursor.fetchall()

            new_id = 1  # Start with ID 1
            for old_id, in remaining_products:
                with connection.cursor() as cursor:
                    cursor.execute('UPDATE products_products SET id = %s WHERE id = %s', [new_id, old_id])
                new_id += 1  # Increment the new ID
            
            # Update the ID sequence for the next product
            next_id = new_id  # The next available ID is after the last reassigned ID
            id_sequence, created = ProductIDSequence.objects.get_or_create(id=1)
            id_sequence.current_id = next_id
            id_sequence.save()

    except Exception as e:
        print(f"Error reassigning product IDs: {e}")
        raise

from rest_framework.permissions import AllowAny
from .models import Products, ProductSerializer

class ProductsForPublicView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        products = Products.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


from .models import SpringOrder, AccessoryOrder, MachineryOrder
@csrf_exempt
def submit_springs_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            spring_order = SpringOrder(
                user_name=data.get('userName'),
                company_name=data.get('companyName'),
                company_address=data.get('companyAddress'),
                company_phone=data.get('companyPhone'),
                spring_size=data.get('springSize'),
                quantity=data.get('quantity'),
                price_per_unit=data.get('pricePerUnit'),
                product_name=data.get('productName')
            )
            spring_order.save()
            return JsonResponse({'message': 'Spring order placed successfully'}, status=201)
        except Exception as e:
            print(f"Error placing spring order: {str(e)}")
            return JsonResponse({'error': 'Failed to place spring order'}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def submit_accessories_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            accessory_order = AccessoryOrder(
                user_name=data.get('userName'),
                company_name=data.get('companyName'),
                company_address=data.get('companyAddress'),
                company_phone=data.get('companyPhone'),
                price=data.get('pricePerUnit'),
                product_name=data.get('productName')
            )
            accessory_order.save()
            return JsonResponse({'message': 'Accessory order placed successfully'}, status=201)
        except Exception as e:
            print(f"Error placing accessory order: {str(e)}")
            return JsonResponse({'error': 'Failed to place accessory order'}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def submit_machineries_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            machinery_order = MachineryOrder(
                user_name=data.get('userName'),
                company_name=data.get('companyName'),
                company_address=data.get('companyAddress'),
                company_phone=data.get('companyPhone'),
                price=data.get('pricePerUnit'),
                product_name=data.get('productName')
            )
            machinery_order.save()
            return JsonResponse({'message': 'Machinery order placed successfully'}, status=201)
        except Exception as e:
            print(f"Error placing machinery order: {str(e)}")
            return JsonResponse({'error': 'Failed to place machinery order'}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

from django.core.mail import EmailMessage
import json
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def send_mail_through_contact(request):
    if request.method == 'POST':
        try:
            # Parse form data from the request body
            form_data = json.loads(request.body)
            name = form_data.get('name')
            subject = form_data.get('subject')
            message = form_data.get('message')
            from_email = form_data.get('email')  # User's email address from the form
            to_email = settings.COMPANY_EMAIL_ADDRESS  # Company's email address
            
            # Debugging: Print the extracted emails to verify
            print(f"From email (user's email): {from_email}")
            print(f"To email (company's email): {to_email}")
            
            # Construct the email message
            email = EmailMessage(
                subject=subject,
                body=f"Message from {name} ({from_email}):\n\n{message}",
                from_email=settings.DEFAULT_FROM_EMAIL,  # Company email or predefined email
                to=[to_email],  # Company's email address
                reply_to=[from_email]  # User's email will be used in the Reply-To header
            )

            # Send the email
            email.send(fail_silently=False)

            # Return success response
            return JsonResponse({"message": "Thank you for reaching out. We will get back to you soon!"}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

        except Exception as e:
            # Return any exception encountered during email sending
            print(f"Error: {e}")
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=400)

from rest_framework import generics, status
from .models import SpringOrderSerializer, AccessoryOrderSerializer, MachineryOrderSerializer

class SpringOrdersList(generics.ListAPIView):
    queryset = SpringOrder.objects.filter(status='open')
    serializer_class = SpringOrderSerializer

# Fetch all open accessory orders
class AccessoryOrdersList(generics.ListAPIView):
    queryset = AccessoryOrder.objects.filter(status='open')
    serializer_class = AccessoryOrderSerializer

# Fetch all open machinery orders
class MachineryOrdersList(generics.ListAPIView):
    queryset = MachineryOrder.objects.filter(status='open')
    serializer_class = MachineryOrderSerializer

# Close an order by updating its status
class CloseOrder(APIView):
    def post(self, request, order_type, pk):
        if order_type == 'spring':
            order = SpringOrder.objects.get(pk=pk)
        elif order_type == 'accessory':
            order = AccessoryOrder.objects.get(pk=pk)
        elif order_type == 'machinery':
            order = MachineryOrder.objects.get(pk=pk)
        else:
            return Response({'error': 'Invalid order type'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = 'closed'
        order.save()
        return Response({'message': f'{order_type.capitalize()} order closed successfully.'})
