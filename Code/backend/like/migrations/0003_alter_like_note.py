# Generated by Django 4.0.3 on 2022-04-20 03:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('note', '0002_note_createddate'),
        ('like', '0002_like_noteid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='like',
            name='note',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='liked_note', to='note.note'),
        ),
    ]
