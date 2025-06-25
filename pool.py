import os
import sys
import subprocess
import threading
from flask import Flask, jsonify
from flask_cors import CORS
import jwt
import time
import requests

# List of required packages (module name, pip package name)
required_packages = [
    ("flask", "flask"),
    ("flask_cors", "flask-cors"),
    ("jwt", "pyjwt"),
    ("requests", "requests"),
    ("cryptography", "cryptography")  # needed for RS256 JWT signing
]

# Check and install missing packages automatically
for module_name, pip_name in required_packages:
    try:
        __import__(module_name)
    except ImportError:
        print(f"[!] {module_name} not found. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", pip_name])
        os.system("cls")  # clear screen after installation (Windows)

print("[+] All modules are installed and ready.")

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)



# Pushover API credentials for alarm notifications
user_key = "user key"
api_token = "api token"
device_name = "device name"
pushover_url = "https://api.pushover.net/1/messages.json"

alarm_thread = None
alarm_running = False

# Function to send alarm notification via Pushover
def send_alarm():
    data = {
        "token": api_token,
        "user": user_key,
        "device": device_name,
        "message": "pool now",
        "title": "pool",
        "sound": "persistent",
        "priority": 1
    }
    try:
        response = requests.post(pushover_url, data=data)
        if response.status_code == 200:
            print("alarm done")
        else:
            print(f"Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error sending alarm: {e}")

# Alarm loop function running in a separate thread, keeps sending alarms while running
def alarm_loop():
    global alarm_running
    while alarm_running:
        send_alarm()

# Flask route to start the alarm thread
@app.route('/start')
def start_alarm():
    global alarm_running, alarm_thread
    if not alarm_running:
        alarm_running = True
        alarm_thread = threading.Thread(target=alarm_loop)
        alarm_thread.start()
        return jsonify({"status": "alarm started"})
    else:
        return jsonify({"status": "alarm already running"})

# Flask route to stop the alarm thread
@app.route('/stop')
def stop_alarm():
    global alarm_running, alarm_thread
    if alarm_running:
        alarm_running = False
        alarm_thread.join()  # wait for the thread to finish
        return jsonify({"status": "alarm stopped"})
    else:
        return jsonify({"status": "alarm not running"})

# Run the Flask app on all network interfaces on port 5000
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
