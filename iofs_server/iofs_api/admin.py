from django.contrib import admin

from iofs_api import models

@admin.register(models.User)
class UserAdmin(admin.ModelAdmin):
    pass

@admin.register(models.PostCategory)
class PostCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'image')
    fields = ('name', 'image')

@admin.register(models.Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('creator', 'category', 'theme')
    fields = ('creator', 'category', 'theme', 'description', 'text', 'created')
    readonly_fields = ('creator', 'created')