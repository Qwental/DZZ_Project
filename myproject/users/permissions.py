from rest_framework import permissions


class IsSelf(permissions.BasePermission):
    """
    Allows users to only access their own data.
    """

    def has_object_permission(self, request, view, obj) -> bool:
        return obj == request.user or request.user.is_staff
