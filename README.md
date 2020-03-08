# Teacher's Paradise
Helping teachers log student attendance

Tech stack: React for frontend, REST Api with python and flask


## Configuration
Update debian system
```
sudo apt update && sudo apt upgrade
sudo apt install nginx python3-venv supervisor htop
```

In directory where application is located 
```
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
```

For runing flask rest api app we need to install 
Gunicorn inside application virtual enviroment
```gunicorn app:app``` 

Supervisor
```
# /etc/supervisor/conf.d/teacher.conf
[program:teacher_paradise]
command=/home/vagrant/pufna.com/backend/venv/bin/gunicorn app:app
directory=/home/vagrant/pufna.com/backend/
user=vagrant
autostart=true
autorestart=true
stdout_logfile=/tmp/teacher_out.log
stderr_logfile=/tmp/teacher_err.log

```

```sudo supervisorctl update```

When upgrading backend application to refresh execute:  
```sudo supervisorctl restart teacher_paradise```


Nginx will serve the static files and be reverse proxy to our backend code.
```
# /etc/nginx/sites-available/pufna.com
server {
  listen 80;
  listen [::]:80;

  root /home/vagrant/pufna.com/frontend;
  index index.html index.htm;

  server_name pufna.com www.pufna.com;


  location / {
    try_files $uri $uri/ =404;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:8000/;
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```


Everything is hosted on VPS [100$ credits to try out VPS](https://www.vultr.com/?ref=8482267-6G) 