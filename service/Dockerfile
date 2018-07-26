FROM python:3.7.0

RUN apt-get update && apt-get install -y nano
ENV PYTHONUNBUFFERED 1

ADD ./fake_crontab.sh /home/fake_crontab.sh
RUN touch /home/fake_cron.log

RUN mkdir /www
WORKDIR /www
ADD ./requirements.txt /www/requirements.txt
RUN pip install -r requirements.txt
COPY . /www

