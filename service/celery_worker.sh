#!/bin/bash

sleep 15

echo "[START] start worker"
celery -A project worker -B -l info
