#!/bin/bash

while true; do
  python /www/manage.py push_updates >> /home/fake_cron.log
  sleep 10;
done