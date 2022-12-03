#!/bin/bash

xset s noblank
xset s off
xset -dpms
unclutter -idle 0.5 -root &

# Remove the X server lock file so ours starts cleanly
rm /tmp/.X0-lock &>/dev/null || true

# Set the display to use
export DISPLAY=:0

# start desktop manager
echo "STARTING X"
sleep 2
startx &
sleep 20

sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/rsn8/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/rsn8/.config/chromium/Default/Preferences

/usr/bin/chromium-browser --noerrdialogs --disable-infobars --unlimited-storage --kiosk --start-fullscreen --app=http://localhost:3000/public &

