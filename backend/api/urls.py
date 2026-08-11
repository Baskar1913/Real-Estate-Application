from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AboutUsViewSet,
    AmenitiesViewSet,
    CategoryViewSet,
    ContactInfoViewSet,
    CountryViewSet,
    CurrentUserView,
    ForgotPasswordView,
    LocationViewSet,
    LoginView,
    LogoutView,
    ProjectViewSet,
    PropertyViewSet,
    RegisterView,
    StateViewSet,
    SubCategoryViewSet,
)

router = DefaultRouter()
router.register("about-us", AboutUsViewSet, basename="about-us")
router.register("amenities", AmenitiesViewSet, basename="amenities")
router.register("categories", CategoryViewSet, basename="categories")
router.register("contact-info", ContactInfoViewSet, basename="contact-info")
router.register("subcategories", SubCategoryViewSet, basename="subcategories")
router.register("countries", CountryViewSet, basename="countries")
router.register("states", StateViewSet, basename="states")
router.register("locations", LocationViewSet, basename="locations")
router.register("properties", PropertyViewSet, basename="properties")
router.register("projects", ProjectViewSet, basename="projects")

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/me/", CurrentUserView.as_view(), name="me"),
    path("auth/forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
] + router.urls
