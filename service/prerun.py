import os

from django.contrib.auth.models import User

DEBUG = bool(os.getenv('DJANGO_DEBUG', 'false'))
DJANGO_ADMIN_LOGIN = os.getenv('DJANGO_ADMIN_LOGIN')
DJANGO_ADMIN_MAIL = os.getenv('DJANGO_ADMIN_MAIL')
DJANGO_ADMIN_PASS = os.getenv('DJANGO_ADMIN_PASS')

if DJANGO_ADMIN_LOGIN is not None and not User.objects.filter(username=DJANGO_ADMIN_LOGIN).exists():
    print(f"[PRERUN] Creating superuser {DJANGO_ADMIN_LOGIN}/{DJANGO_ADMIN_PASS} ({DJANGO_ADMIN_MAIL})")
    user = User.objects.create_superuser(DJANGO_ADMIN_LOGIN, DJANGO_ADMIN_MAIL, DJANGO_ADMIN_PASS)
    user.first_name = 'Super'
    user.last_name = 'User'
    user.save()
else:
    print("[PRERUN] Admin entry exist or not required")
