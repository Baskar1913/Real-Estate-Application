from django.db import models


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(TimestampedModel):
    name = models.CharField(max_length=100)
    app_id = models.IntegerField(default=1)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class SubCategory(TimestampedModel):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories")
    app_id = models.IntegerField(default=1)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "subcategories"

    def __str__(self):
        return self.name


class Country(TimestampedModel):
    name = models.CharField(max_length=100)
    app_id = models.IntegerField(default=1)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "countries"

    def __str__(self):
        return self.name


class State(TimestampedModel):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="states")
    app_id = models.IntegerField(default=1)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Location(TimestampedModel):
    name = models.CharField(max_length=100)
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name="locations")
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="locations")
    app_id = models.IntegerField(default=1)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class AboutUs(TimestampedModel):
    banner = models.ImageField(upload_to="about/banners/", blank=True, null=True)
    image = models.ImageField(upload_to="about/images/", blank=True, null=True)
    title1 = models.CharField(max_length=180)
    title2 = models.CharField(max_length=180, blank=True)
    description = models.TextField()
    app_id = models.IntegerField(default=1)

    class Meta:
        verbose_name_plural = "about us"

    def __str__(self):
        return self.title1


class PropertyBase(TimestampedModel):
    banner = models.ImageField(upload_to="properties/", blank=True, null=True)
    title = models.CharField(max_length=180)
    price = models.DecimalField(max_digits=14, decimal_places=2)
    location = models.ForeignKey(Location, on_delete=models.PROTECT)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.PROTECT)
    no_of_bedrooms = models.PositiveIntegerField(default=0)
    no_of_washrooms = models.PositiveIntegerField(default=0)
    area = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField()
    app_id = models.IntegerField(default=1)

    class Meta:
        abstract = True
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Property(PropertyBase):
    featured = models.BooleanField(default=False)


class Project(PropertyBase):
    STATUS_CHOICES = [
        ("upcoming", "Upcoming"),
        ("ongoing", "Ongoing"),
        ("completed", "Completed"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="ongoing")


class Amenities(TimestampedModel):
    name = models.CharField(max_length=100)
    feature_id = models.IntegerField(default=1)
    app_id = models.IntegerField(default=1)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "amenities"

    def __str__(self):
        return self.name


class ContactInfo(TimestampedModel):
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    map_url = models.URLField(blank=True)
    app_id = models.IntegerField(default=1)

    class Meta:
        verbose_name_plural = "contact information"

    def __str__(self):
        return self.email
