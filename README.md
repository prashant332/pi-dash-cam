# pi-dash-cam
A simple implementation of car dash camera application to run on raspberry pi/zero with camera attachment. 

# Dependency
It uses redis to store config and running recording data. So it needs the redis built and available in pi to function correctly. Download and install redis from - http://download.redis.io/releases/redis-5.0.3.tar.gz

# How to run?
> cd pi-dash-node

> npm install

> npm start

Assuming the camera module attached to pi and enabled from raspi-config.

To set up auto start upon boot,

edit /home/pi/.config/lxsession/LXDE-pi/autostart and add commands to start redis and application at the end.

# How it works?
- It uses raspistill and raspivid to generate looping video recordings.
- Few basic options can be changed by opening http://ip-address:3000/setting
- This offers a free input field to add any special command options (dont do it if you are not familiar with raspivid)
- http://ip-address:3000/videos to get the list of videos captured and you can tag not to remove, download or delete it
- The loop timer checks the available disk with every iteration and removes oldest video if available disk is less then 20%

Any questions, please comment or email.
