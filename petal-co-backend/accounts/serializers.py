from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    isAdmin = serializers.BooleanField(source="is_admin", read_only=True)

    class Meta:
        model = User
        fields = [
            "id", "email", "first_name", "last_name",
            "phone", "city", "state", "isAdmin", "date_joined",
        ]
        read_only_fields = ["id", "isAdmin", "date_joined"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["email", "first_name", "last_name", "phone", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        # username has to be set to something unique; email works fine.
        user = User(username=validated_data["email"], **validated_data)
        user.set_password(password)
        user.save()
        return user


class PetalTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Same as the default SimpleJWT serializer, but the response body
    also includes the user's profile (incl. isAdmin) so the frontend
    doesn't need a second round trip to decide whether to route the
    person to /admin.
    """

    username_field = User.USERNAME_FIELD

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data
