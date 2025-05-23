from backend.app import database, models
from sqlalchemy.orm import Session

db: Session = database.SessionLocal()

cats = {
    "حواجز": [
        ("حاجز واقي", 75.0),
        ("ركيزة", 5.0),
        ("عاكس مفرد", 2.0),
        ("عاكس مزدوج", 4.0),
        ("حاجز أرضي", 10.0),
        ("كوع", 3.5)
    ],
    "لوائح": [
        ("لائحة إرشادية دائرية قطر 900 مم", 140.0),
        ("عمود لائحة إرشادية قطر 4 إنش", 55.0)
    ]
}

for cname, items in cats.items():
    c = models.Category(name_ar=cname)
    db.add(c)
    db.flush()
    for desc, price in items:
        db.add(models.Item(description_ar=desc, price=price, category_id=c.id))

db.add_all([models.Engineer(name_ar=n) for n in ["يوسف المكتبي", "أحمد الزدجالي"]])
db.add_all([models.Wilaya(name_ar=w) for w in ["الداخلية", "الظاهرة", "مسقط"]])

db.commit()
print("تم إدخال البيانات التجريبية ✅")
