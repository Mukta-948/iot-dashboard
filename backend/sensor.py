import requests
import random
import time

while True:
    data = {
        "temperature": random.randint(20, 40),
        "humidity": random.randint(40, 80)
    }
    res = requests.post("http://localhost:5000/sensor-data", json=data)
    print("Sent:", data)
    time.sleep(2)