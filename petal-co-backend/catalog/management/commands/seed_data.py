from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from catalog.models import Collection, Product

User = get_user_model()

COLLECTIONS = [
    {"slug": "hampers", "name": "Gift Hampers", "tagline": "Curated boxes for every occasion", "gradient": ["#f1cdd2", "#c79a3e"]},
    {"slug": "pendants", "name": "Pendants", "tagline": "Small charms, big meaning", "gradient": ["#e7c9d6", "#7a2b3f"]},
    {"slug": "bracelets", "name": "Bracelets", "tagline": "Stack-friendly everyday pieces", "gradient": ["#f3e6d8", "#b34a5c"]},
    {"slug": "earrings", "name": "Earrings", "tagline": "From studs to statements", "gradient": ["#f8e3e6", "#c79a3e"]},
    {"slug": "jhumkas", "name": "Jhumkas", "tagline": "Festive drop earrings", "gradient": ["#e9d5c0", "#7a2b3f"]},
    {"slug": "rings", "name": "Rings", "tagline": "Delicate everyday bands", "gradient": ["#f1cdd2", "#77836a"]},
    {"slug": "keychains", "name": "Keychains", "tagline": "A little something for the everyday carry", "gradient": ["#e0d3ea", "#591f2e"]},
    {"slug": "scrunchies", "name": "Scrunchies", "tagline": "Soft ties, softer palettes", "gradient": ["#f8e3e6", "#b34a5c"]},
    {"slug": "claw-clips", "name": "Claw Clips", "tagline": "Hold-all-day hair essentials", "gradient": ["#f3e6d8", "#c79a3e"]},
    {"slug": "packaging", "name": "Custom Packaging", "tagline": "Dress up any box your way", "gradient": ["#e9d5c0", "#7a2b3f"]},
]

PRODUCTS = [
    {"slug": "amber-bloom-hamper", "name": "Amber Bloom Hamper", "price": "1899", "compare_at": "2399", "category": "Hampers", "collections": ["hampers"], "image_key": "hamper", "gradient": ["#f1cdd2", "#c79a3e"], "badge": "Bestseller", "description": "A layered keepsake box with a scented candle, a charm bracelet, and a hand-folded note card.", "stock": 18, "rating": "4.8", "reviews_count": 132},
    {"slug": "midnight-plum-hamper", "name": "Midnight Plum Hamper", "price": "2299", "compare_at": "2899", "category": "Hampers", "collections": ["hampers"], "image_key": "hamper", "gradient": ["#7a2b3f", "#2b2320"], "badge": "Sale", "description": "Deep plum velvet box featuring a pendant, a mini perfume, and Belgian chocolates.", "stock": 9, "rating": "4.9", "reviews_count": 87},
    {"slug": "sunlit-rakhi-set", "name": "Sunlit Rakhi Hamper", "price": "1499", "compare_at": "1899", "category": "Hampers", "collections": ["hampers"], "image_key": "hamper", "gradient": ["#c79a3e", "#f1cdd2"], "badge": "Sale", "description": "A sibling-day box with a woven rakhi, roasted almonds, and a handwritten card slot.", "stock": 24, "rating": "4.7", "reviews_count": 64},
    {"slug": "tulip-drop-pendant", "name": "Tulip Drop Pendant", "price": "349", "category": "Pendants", "collections": ["pendants"], "image_key": "pendant", "gradient": ["#e7c9d6", "#7a2b3f"], "badge": "New", "description": "A hand-finished brass tulip on an adjustable 18-inch chain.", "stock": 41, "rating": "4.6", "reviews_count": 51},
    {"slug": "aster-locket-pendant", "name": "Aster Locket Pendant", "price": "429", "category": "Pendants", "collections": ["pendants"], "image_key": "pendant", "gradient": ["#b34a5c", "#f3e6d8"], "badge": "", "description": "An openable locket pendant with room for a photo or a pressed flower.", "stock": 22, "rating": "4.5", "reviews_count": 38},
    {"slug": "woven-thread-bracelet", "name": "Woven Thread Bracelet", "price": "249", "category": "Bracelets", "collections": ["bracelets"], "image_key": "bracelet", "gradient": ["#f3e6d8", "#b34a5c"], "badge": "", "description": "Adjustable cord bracelet with a brass sliding knot.", "stock": 60, "rating": "4.4", "reviews_count": 76},
    {"slug": "petal-charm-bracelet", "name": "Petal Charm Bracelet", "price": "399", "compare_at": "549", "category": "Bracelets", "collections": ["bracelets"], "image_key": "bracelet", "gradient": ["#f1cdd2", "#77836a"], "badge": "Sale", "description": "Five enamel petal charms on a fine chain bracelet with lobster clasp.", "stock": 14, "rating": "4.7", "reviews_count": 44},
    {"slug": "dew-drop-studs", "name": "Dew Drop Studs", "price": "199", "category": "Earrings", "collections": ["earrings"], "image_key": "earring", "gradient": ["#f8e3e6", "#c79a3e"], "badge": "", "description": "Minimal glass-bead studs that catch light without ever feeling heavy.", "stock": 55, "rating": "4.5", "reviews_count": 29},
    {"slug": "gilded-hoop-set", "name": "Gilded Hoop Set (3 pairs)", "price": "349", "compare_at": "449", "category": "Earrings", "collections": ["earrings"], "image_key": "earring", "gradient": ["#c79a3e", "#7a2b3f"], "badge": "Sale", "description": "Three hoop sizes in a set — small, medium, statement.", "stock": 30, "rating": "4.6", "reviews_count": 58},
    {"slug": "moonlight-jhumka", "name": "Moonlight Jhumka", "price": "249", "category": "Jhumkas", "collections": ["jhumkas"], "image_key": "jhumka", "gradient": ["#e9d5c0", "#7a2b3f"], "badge": "Bestseller", "description": "Pearl-drop jhumkas with a matte gold dome.", "stock": 27, "rating": "4.8", "reviews_count": 91},
    {"slug": "peacock-dance-jhumka", "name": "Peacock Dance Jhumka", "price": "199", "category": "Jhumkas", "collections": ["jhumkas"], "image_key": "jhumka", "gradient": ["#77836a", "#7a2b3f"], "badge": "", "description": "Hand-painted peacock motif jhumkas with a jhalar fringe.", "stock": 33, "rating": "4.6", "reviews_count": 40},
    {"slug": "signet-band-ring", "name": "Signet Band Ring", "price": "179", "category": "Rings", "collections": ["rings"], "image_key": "ring", "gradient": ["#f1cdd2", "#77836a"], "badge": "", "description": "Adjustable brass signet band that sits flush against the finger.", "stock": 48, "rating": "4.4", "reviews_count": 22},
    {"slug": "stacked-stone-ring", "name": "Stacked Stone Ring", "price": "229", "compare_at": "299", "category": "Rings", "collections": ["rings"], "image_key": "ring", "gradient": ["#b34a5c", "#c79a3e"], "badge": "Sale", "description": "A trio of thin bands set with a single cut-glass stone each.", "stock": 19, "rating": "4.5", "reviews_count": 31},
    {"slug": "spirit-fox-keychain", "name": "Spirit Fox Keychain", "price": "149", "category": "Keychains", "collections": ["keychains"], "image_key": "keychain", "gradient": ["#e0d3ea", "#591f2e"], "badge": "", "description": "Enamel fox charm keychain with a solid clip ring.", "stock": 70, "rating": "4.3", "reviews_count": 18},
    {"slug": "wanderer-map-keychain", "name": "Wanderer Map Keychain", "price": "139", "category": "Keychains", "collections": ["keychains"], "image_key": "keychain", "gradient": ["#c79a3e", "#2b2320"], "badge": "", "description": "A tiny embossed compass keychain for the one always planning the next trip.", "stock": 44, "rating": "4.4", "reviews_count": 25},
    {"slug": "silk-touch-scrunchie", "name": "Silk-Touch Scrunchie Set (3)", "price": "179", "category": "Scrunchies", "collections": ["scrunchies"], "image_key": "scrunchie", "gradient": ["#f8e3e6", "#b34a5c"], "badge": "", "description": "Three oversized scrunchies in complementary tones.", "stock": 38, "rating": "4.6", "reviews_count": 34},
    {"slug": "linen-bow-scrunchie", "name": "Linen Bow Scrunchie", "price": "99", "category": "Scrunchies", "collections": ["scrunchies"], "image_key": "scrunchie", "gradient": ["#f3e6d8", "#7a2b3f"], "badge": "", "description": "A textured linen scrunchie with an oversized bow tail.", "stock": 52, "rating": "4.2", "reviews_count": 15},
    {"slug": "pearl-edge-claw-clip", "name": "Pearl-Edge Claw Clip", "price": "129", "category": "Claw Clips", "collections": ["claw-clips"], "image_key": "clip", "gradient": ["#f3e6d8", "#c79a3e"], "badge": "New", "description": "A strong-grip claw clip trimmed with faux pearls.", "stock": 40, "rating": "4.5", "reviews_count": 27},
    {"slug": "tortoise-claw-clip", "name": "Tortoise Claw Clip", "price": "99", "category": "Claw Clips", "collections": ["claw-clips"], "image_key": "clip", "gradient": ["#c79a3e", "#2b2320"], "badge": "", "description": "Classic tortoiseshell-pattern acetate claw clip, medium size.", "stock": 65, "rating": "4.3", "reviews_count": 20},
    {"slug": "ribbon-wrap-box", "name": "Ribbon-Wrap Gift Box", "price": "79", "category": "Packaging", "collections": ["packaging"], "image_key": "box", "gradient": ["#e9d5c0", "#7a2b3f"], "badge": "", "description": "Add this to any order — a rigid gift box in cream, hand-wrapped with satin ribbon.", "stock": 100, "rating": "4.7", "reviews_count": 48},
    {"slug": "petal-note-card", "name": "Petal Note Card", "price": "39", "category": "Packaging", "collections": ["packaging"], "image_key": "card", "gradient": ["#f1cdd2", "#77836a"], "badge": "", "description": "A pressed-petal note card with an envelope, blank inside.", "stock": 120, "rating": "4.6", "reviews_count": 33},
    {"slug": "twilight-anklet", "name": "Twilight Anklet", "price": "189", "category": "Bracelets", "collections": ["bracelets"], "image_key": "bracelet", "gradient": ["#591f2e", "#c79a3e"], "badge": "Sold out", "description": "A fine chain anklet with a single teardrop charm.", "stock": 0, "rating": "4.5", "reviews_count": 19},
    {"slug": "star-drop-earring", "name": "Star Drop Earring", "price": "229", "category": "Earrings", "collections": ["earrings"], "image_key": "earring", "gradient": ["#7a2b3f", "#f1cdd2"], "badge": "New", "description": "Single star charm drop earrings in brushed gold finish.", "stock": 26, "rating": "4.4", "reviews_count": 12},
    {"slug": "harvest-bangle-combo", "name": "Harvest Bangle Combo", "price": "349", "compare_at": "499", "category": "Bracelets", "collections": ["bracelets", "hampers"], "image_key": "bracelet", "gradient": ["#c79a3e", "#7a2b3f"], "badge": "Sale", "description": "A set of four stacking bangles in warm autumn tones.", "stock": 21, "rating": "4.6", "reviews_count": 37},
]


class Command(BaseCommand):
    help = "Seeds collections, products, an admin account, and a sample customer."

    def handle(self, *args, **options):
        collections_by_slug = {}
        for c in COLLECTIONS:
            obj, _ = Collection.objects.update_or_create(
                slug=c["slug"],
                defaults={
                    "name": c["name"],
                    "tagline": c["tagline"],
                    "gradient_start": c["gradient"][0],
                    "gradient_end": c["gradient"][1],
                },
            )
            collections_by_slug[c["slug"]] = obj
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(COLLECTIONS)} collections."))

        for p in PRODUCTS:
            obj, _ = Product.objects.update_or_create(
                slug=p["slug"],
                defaults={
                    "name": p["name"],
                    "price": p["price"],
                    "compare_at": p.get("compare_at"),
                    "category": p["category"],
                    "image_key": p["image_key"],
                    "gradient_start": p["gradient"][0],
                    "gradient_end": p["gradient"][1],
                    "badge": p["badge"],
                    "description": p["description"],
                    "stock": p["stock"],
                    "rating": p["rating"],
                    "reviews_count": p["reviews_count"],
                },
            )
            obj.collections.set([collections_by_slug[s] for s in p["collections"]])
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(PRODUCTS)} products."))

        if not User.objects.filter(email="admin@petalandco.test").exists():
            User.objects.create_superuser(
                username="admin@petalandco.test",
                email="admin@petalandco.test",
                password="AdminPetal123!",
                first_name="Store",
                last_name="Admin",
            )
            self.stdout.write(self.style.SUCCESS(
                "Created admin login -> admin@petalandco.test / AdminPetal123!  (CHANGE THIS PASSWORD)"
            ))

        if not User.objects.filter(email="customer@petalandco.test").exists():
            u = User(
                username="customer@petalandco.test",
                email="customer@petalandco.test",
                first_name="Ananya",
                last_name="Verma",
                city="Indore",
                state="MP",
            )
            u.set_password("Customer123!")
            u.save()
            self.stdout.write(self.style.SUCCESS(
                "Created sample customer login -> customer@petalandco.test / Customer123!"
            ))
