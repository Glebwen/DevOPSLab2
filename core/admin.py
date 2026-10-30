from django.contrib import admin
from .models import Client, Bearing, Order

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone')

@admin.register(Bearing)
class BearingAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'amount')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'bearing', 'quantity')