# Generated by Django 5.0.6 on 2024-08-12 07:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0006_alter_products_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productidsequence',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]