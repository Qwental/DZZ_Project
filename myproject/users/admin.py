from django.contrib import admin
from users.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["__str__", "username",
                    "first_name", "last_name", "email", ]
    search_fields = ["username", "first_name", "last_name", "email", ]
