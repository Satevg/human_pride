### Human Pride :D

An example app showing people's latest search queries from yandex. Built with websockets and redis (django-channels).

Main files are:
- As i call it - [fake crontab bash script](service/fake_crontab.sh)
- [push_updates management command](service/pride/management/commands/push_updates.py)
- [Consumers file](service/pride/consumers.py) and of course [frontend javascript](service/pride/static/js/main.js)

That's it.
