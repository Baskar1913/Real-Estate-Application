from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AboutUs, Amenities, Category, ContactInfo, Country, Location, Project, Property, State, SubCategory
from .permissions import IsAdminOrReadOnly
from .serializers import (
    AboutUsSerializer,
    AmenitiesSerializer,
    CategorySerializer,
    ContactInfoSerializer,
    CountrySerializer,
    ForgotPasswordSerializer,
    LocationSerializer,
    LoginSerializer,
    ProjectSerializer,
    PropertySerializer,
    RegisterSerializer,
    StateSerializer,
    SubCategorySerializer,
)


def user_payload(user):
    return {
        "id": user.id,
        "name": user.get_full_name() or user.username,
        "email": user.email,
        "role": "admin" if user.is_staff else "user",
    }


class RegisterView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"message": "Account created successfully.", "token": token.key, "user": user_payload(user)},
            status=status.HTTP_201_CREATED,
        )


class LoginView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].strip().lower()
        requested_role = serializer.validated_data["role"]
        if requested_role == "admin" and not email.endswith("@ssintern.in"):
            return Response(
                {"message": "Administrator login requires an @ssintern.in email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        existing_user = User.objects.filter(email__iexact=email).first()
        user = None
        if existing_user:
            user = authenticate(
                request=request,
                username=existing_user.username,
                password=serializer.validated_data["password"],
            )
        if user is None:
            return Response({"message": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
        if not user.is_active:
            return Response({"message": "This account is disabled."}, status=status.HTTP_403_FORBIDDEN)
        if requested_role == "admin" and not user.is_staff:
            return Response(
                {"message": "This account does not have administrator access."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if requested_role == "user" and user.is_staff:
            return Response(
                {"message": "Administrator accounts must use Admin Login."},
                status=status.HTTP_403_FORBIDDEN,
            )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"message": "Login successful.", "token": token.key, "user": user_payload(user)})


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: OpenApiResponse(description="Authenticated user details")})
    def get(self, request):
        return Response(user_payload(request.user))


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(request=None, responses={200: OpenApiResponse(description="Logged out")})
    def post(self, request):
        if request.auth:
            request.auth.delete()
        return Response({"message": "Logged out successfully."})


class ForgotPasswordView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = ForgotPasswordSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].strip().lower()
        requested_role = serializer.validated_data["role"]
        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            return Response({"message": "Account not found."}, status=status.HTTP_404_NOT_FOUND)
        if requested_role == "admin" and (not email.endswith("@ssintern.in") or not user.is_staff):
            return Response({"message": "Administrator account not found."}, status=status.HTTP_403_FORBIDDEN)
        if requested_role == "user" and user.is_staff:
            return Response({"message": "Use Admin password recovery for this account."}, status=status.HTTP_403_FORBIDDEN)
        if serializer.validated_data["step"] == "verify":
            return Response({"message": "Account verified."})
        user.set_password(serializer.validated_data["password"])
        user.save()
        Token.objects.filter(user=user).delete()
        return Response({"message": "Password reset successfully."})


class SecuredModelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]


class AboutUsViewSet(SecuredModelViewSet):
    queryset = AboutUs.objects.all()
    serializer_class = AboutUsSerializer


class AmenitiesViewSet(SecuredModelViewSet):
    queryset = Amenities.objects.all()
    serializer_class = AmenitiesSerializer


class ContactInfoViewSet(SecuredModelViewSet):
    queryset = ContactInfo.objects.all()
    serializer_class = ContactInfoSerializer


class CategoryViewSet(SecuredModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SubCategoryViewSet(SecuredModelViewSet):
    queryset = SubCategory.objects.select_related("category").all()
    serializer_class = SubCategorySerializer


class CountryViewSet(SecuredModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class StateViewSet(SecuredModelViewSet):
    queryset = State.objects.select_related("country").all()
    serializer_class = StateSerializer


class LocationViewSet(SecuredModelViewSet):
    queryset = Location.objects.select_related("state", "country").all()
    serializer_class = LocationSerializer


class PropertyViewSet(SecuredModelViewSet):
    queryset = Property.objects.select_related("location", "category", "subcategory").all()
    serializer_class = PropertySerializer


class ProjectViewSet(SecuredModelViewSet):
    queryset = Project.objects.select_related("location", "category", "subcategory").all()
    serializer_class = ProjectSerializer
