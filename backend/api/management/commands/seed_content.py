from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand

from api.models import (
    AboutUs,
    Amenities,
    Category,
    ContactInfo,
    Country,
    Location,
    Project,
    Property,
    State,
    SubCategory,
)


ASSET_DIR = Path(__file__).resolve().parents[3] / "sample_media"


def attach_image(instance, field_name, filename):
    field = getattr(instance, field_name)
    if field:
        return
    with (ASSET_DIR / filename).open("rb") as image_file:
        field.save(filename, File(image_file), save=True)


class Command(BaseCommand):
    help = "Create a complete optional demo portfolio without login credentials."

    def handle(self, *_args, **_options):
        india, _ = Country.objects.get_or_create(name="India", defaults={"app_id": 1})
        tamil_nadu, _ = State.objects.get_or_create(name="Tamil Nadu", country=india, defaults={"app_id": 1})
        karnataka, _ = State.objects.get_or_create(name="Karnataka", country=india, defaults={"app_id": 1})

        vellore, _ = Location.objects.get_or_create(name="Vellore", state=tamil_nadu, country=india, defaults={"app_id": 1})
        chennai, _ = Location.objects.get_or_create(name="Chennai", state=tamil_nadu, country=india, defaults={"app_id": 1})
        ranipet, _ = Location.objects.get_or_create(name="Ranipet", state=tamil_nadu, country=india, defaults={"app_id": 1})
        bengaluru, _ = Location.objects.get_or_create(name="Bengaluru", state=karnataka, country=india, defaults={"app_id": 1})

        residential, _ = Category.objects.get_or_create(name="Residential", defaults={"app_id": 1})
        commercial, _ = Category.objects.get_or_create(name="Commercial", defaults={"app_id": 1})
        land, _ = Category.objects.get_or_create(name="Land", defaults={"app_id": 1})

        apartment, _ = SubCategory.objects.get_or_create(name="Apartment", category=residential, defaults={"app_id": 1})
        villa, _ = SubCategory.objects.get_or_create(name="Villa", category=residential, defaults={"app_id": 1})
        house, _ = SubCategory.objects.get_or_create(name="Independent House", category=residential, defaults={"app_id": 1})
        office, _ = SubCategory.objects.get_or_create(name="Office Space", category=commercial, defaults={"app_id": 1})
        shop, _ = SubCategory.objects.get_or_create(name="Retail Shop", category=commercial, defaults={"app_id": 1})
        plot, _ = SubCategory.objects.get_or_create(name="Residential Plot", category=land, defaults={"app_id": 1})

        about, _ = AboutUs.objects.get_or_create(
            title1="Local knowledge. Lasting relationships.",
            defaults={
                "title2": "Property guidance built on trust",
                "description": (
                    "Real Estate Properties connects buyers and investors with carefully verified homes, "
                    "commercial spaces and plotted developments across Tamil Nadu and Bengaluru. Our advisors "
                    "combine neighbourhood knowledge, transparent pricing and dependable support from the first "
                    "visit through the final decision."
                ),
                "app_id": 1,
            },
        )
        attach_image(about, "banner", "home-hero.png")
        attach_image(about, "image", "about-advisors.png")

        property_data = [
            ("Palm Grove Signature Villa", "vellore-villa.png", 18500000, vellore, residential, villa, 4, 4, 3250, "A refined four-bedroom villa with a sunlit double-height living area, landscaped garden, covered parking and quick access to Vellore's schools, hospitals and business districts.", True),
            ("Skyline Residences", "chennai-apartment.png", 14500000, chennai, residential, apartment, 3, 3, 2180, "A spacious city apartment with panoramic views, premium finishes, generous natural light and thoughtfully planned family spaces in a well-connected Chennai neighbourhood.", True),
            ("Lakeview Family Home", "vellore-villa.png", 9200000, ranipet, residential, house, 3, 3, 2100, "A peaceful independent family home with contemporary interiors, a private terrace, excellent ventilation and convenient access to the industrial corridor.", False),
            ("Orion Business Suites", "bengaluru-office.png", 27500000, bengaluru, commercial, office, 0, 2, 3100, "A Grade-A office suite in a landscaped technology district with flexible floor planning, modern common areas, reliable power and excellent city connectivity.", True),
            ("Arcot Highway Retail Hub", "bengaluru-office.png", 7800000, vellore, commercial, shop, 0, 1, 980, "A high-visibility retail unit on a growing commercial corridor, designed for showrooms, speciality stores and customer-facing businesses.", False),
            ("Green Hills Residential Plot", "vellore-plots.png", 3600000, vellore, land, plot, 0, 0, 2400, "A ready-to-build residential plot in a gated green layout with paved roads, street lighting, drainage and a calm view toward the surrounding hills.", True),
        ]
        for title, image, price, location, category, subcategory, beds, baths, area, description, featured in property_data:
            item, _ = Property.objects.get_or_create(
                title=title,
                defaults={"price": price, "location": location, "category": category, "subcategory": subcategory, "no_of_bedrooms": beds, "no_of_washrooms": baths, "area": area, "description": description, "featured": featured, "app_id": 1},
            )
            attach_image(item, "banner", image)

        project_data = [
            ("Earthwood Villa Enclave", "home-hero.png", 16000000, vellore, residential, villa, 4, 4, 2900, "A low-density gated villa community shaped around mature greenery, walkable streets, a residents' clubhouse and elegant contemporary homes.", "ongoing"),
            ("Marina Crown Residences", "chennai-apartment.png", 12000000, chennai, residential, apartment, 3, 3, 1950, "An upcoming premium residential tower with landscaped terraces, wellness amenities and easy access to Chennai's employment and lifestyle destinations.", "upcoming"),
            ("Vellore Greenfield Plots", "vellore-plots.png", 2800000, vellore, land, plot, 0, 0, 1800, "A planned plotted community with clear titles, wide black-top roads, avenue plantations, essential utilities and excellent long-term investment potential.", "ongoing"),
        ]
        for title, image, price, location, category, subcategory, beds, baths, area, description, project_status in project_data:
            item, _ = Project.objects.get_or_create(
                title=title,
                defaults={"price": price, "location": location, "category": category, "subcategory": subcategory, "no_of_bedrooms": beds, "no_of_washrooms": baths, "area": area, "description": description, "status": project_status, "app_id": 1},
            )
            attach_image(item, "banner", image)

        amenities = ["24/7 Security", "Covered Parking", "Fitness Centre", "Swimming Pool", "Power Backup", "Children's Play Area", "Landscaped Garden", "High-speed Wi-Fi"]
        for feature_id, name in enumerate(amenities, start=1):
            Amenities.objects.get_or_create(name=name, defaults={"feature_id": feature_id, "app_id": 1})

        ContactInfo.objects.get_or_create(
            email="hello@realestateproperties.com",
            defaults={
                "phone": "+91 98765 00043",
                "address": "Vellore, Tamil Nadu, India",
                "map_url": "https://maps.google.com/?q=Vellore,Tamil+Nadu",
                "app_id": 1,
            },
        )
        self.stdout.write(self.style.SUCCESS("Complete demo portfolio and images created. No login credentials were generated."))
