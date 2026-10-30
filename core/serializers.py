from rest_framework import serializers
from .models import Client, Bearing, Order

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class BearingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bearing
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    client_name = serializers.ReadOnlyField(source='client.name')
    bearing_name = serializers.ReadOnlyField(source='bearing.name')

    class Meta:
        model = Order
        fields = '__all__'