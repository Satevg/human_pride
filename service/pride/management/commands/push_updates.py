import redis
import requests
import xml.etree.ElementTree as ET

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'PUSH message to listeners via websocket'
    redis_key = 'pride'

    def handle(self, *args, **options):
        r = redis.Redis(host='redis', port=6379, db=0)
        list_length = r.llen(self.redis_key)
        if list_length < 41:
            response = requests.get('https://export.yandex.ru/last/last20x.xml')
            last_pride = ET.fromstring(response.content)[0]
            queries = [item.text for item in last_pride]
            r.rpush(self.redis_key, *queries)

        return_num = 20
        elements = r.lrange(self.redis_key, 0, return_num - 1)
        r.ltrim(self.redis_key, return_num, list_length - 1)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)('human_pride', {
            'type': 'group_message',
            'message': [el.decode('utf-8') for el in elements],
        })
        self.stdout.write(self.style.SUCCESS('Done'))
