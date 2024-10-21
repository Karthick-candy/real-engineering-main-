from django.contrib.auth.models import User
from products.models import Profile
from django.utils import timezone
import pytz
ist = pytz.timezone('Asia/Kolkata')
user = User.objects.create_superuser(
    username='AdminKarthick',            
    email='realadmin01@gmail.com',   
    password='Admin01@real',     
    first_name='Karthick',          
    last_name='Thanarasu',        
)

now_ist = timezone.now().astimezone(ist)  
user.last_login = now_ist  
user.is_staff = True       
user.is_active = True      
user.date_joined = now_ist  
user.save()        

phone_number = '8072813277'
Profile.objects.update_or_create(
    user=user,
    defaults={'phone_number': phone_number}
)
