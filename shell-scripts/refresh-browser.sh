#!/bin/bash

export DISPLAY=:0.0
export XAUTHORITY=/home/pi/.Xauthority

while true;
do
  xdotool key ctrl+r &

  sleep 1 #refresh time in seconds
done

echo "Refreshing Browser"
