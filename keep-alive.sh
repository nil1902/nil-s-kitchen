#!/bin/bash

SERVER_URL="https://your-server-url.com/health"

while true; do
  current_hour=$(date +%H)
  
  # Check if current time is between 2 PM (14) and 10 PM (22)
  if [ $current_hour -ge 14 ] && [ $current_hour -lt 22 ]; then
    echo "$(date): Pinging server..."
    curl -f $SERVER_URL > /dev/null 2>&1
    if [ $? -eq 0 ]; then
      echo "✅ Ping successful"
    else
      echo "❌ Ping failed"
    fi
  else
    echo "$(date): Outside business hours, sleeping..."
  fi
  
  # Wait 10 minutes (600 seconds)
  sleep 600
done