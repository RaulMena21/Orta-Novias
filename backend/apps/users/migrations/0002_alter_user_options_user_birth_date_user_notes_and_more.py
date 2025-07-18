# Generated by Django 5.2.4 on 2025-07-11 23:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'verbose_name': 'Usuario', 'verbose_name_plural': 'Usuarios'},
        ),
        migrations.AddField(
            model_name='user',
            name='birth_date',
            field=models.DateField(blank=True, null=True, verbose_name='Fecha de nacimiento'),
        ),
        migrations.AddField(
            model_name='user',
            name='notes',
            field=models.TextField(blank=True, verbose_name='Notas'),
        ),
        migrations.AddField(
            model_name='user',
            name='phone',
            field=models.CharField(blank=True, max_length=20, null=True, verbose_name='Teléfono'),
        ),
        migrations.AddField(
            model_name='user',
            name='wedding_date',
            field=models.DateField(blank=True, null=True, verbose_name='Fecha de boda'),
        ),
    ]
