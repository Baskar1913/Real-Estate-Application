from django.contrib import admin

from .models import AboutUs, Amenities, Category, ContactInfo, Country, Location, Project, Property, State, SubCategory

admin.site.site_header = "Real Estate Properties Administration"
admin.site.register([AboutUs, Amenities, Category, SubCategory, Country, State, Location, Property, Project, ContactInfo])
