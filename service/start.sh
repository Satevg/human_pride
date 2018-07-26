#!/bin/bash

if [ "$DJANGO_DEBUG" = "true" ]; then
    echo "[START] install dependencies"
    pip install -r requirements.txt
fi

echo "[START] apply migrations"
python manage.py migrate

if [ "$PRERUN" = "true" ]; then
    echo "[START] run prerun.py script:"
    echo "exec(open('prerun.py').read())" | python manage.py shell
fi

echo "[START] Fake crontab job"
/bin/bash /home/fake_crontab.sh &

if [ "$DJANGO_DEBUG" = "true" ]; then
    # remove static files(if there are) for django to serve them from application folders instead of nginx
    rm -rf /www/static/*
    echo "[START] launch app in debug mode"
    python manage.py runserver 0.0.0.0:8000
else
    echo "[START] collect static resources"
    python manage.py collectstatic --noinput
    echo "[START] launch app in release mode"
    uwsgi --chdir=. \
      --module=project.wsgi:application \
      --env DJANGO_SETTINGS_MODULE=project.settings \
      --master \
      --http=0.0.0.0:8000 \
      --processes=2 \
      --uid=1000 --gid=2000 \
      --harakiri=20 \
      --max-requests=5000 \
      --vacuum \
      --master-fifo /tmp/uwsgififo
fi
