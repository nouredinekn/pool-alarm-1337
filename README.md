# 📡 Auto Pool Checker & Alarm System — by Delone

This project automates checking the [1337.ma](https://admission.1337.ma) admission page for available pool slots.  
It automatically logs in, scrolls the page, checks availability, and sends alerts via **Telegram**, **Pushover**, and a local **Flask alarm server**.

---

## 🧠 Features

✅ Auto-scrolls the page  
✅ Detects loading indicators  
✅ Automatically logs in with stored credentials  
✅ Checks for the absence of "No Pool" text  
✅ Sends **Telegram** notifications  
✅ Triggers persistent alarm via **Flask server** and **Pushover**  
✅ Auto-refreshes page every 20 seconds  
✅ Stops alarm if no pool is found

---

## 🛠️ Technologies Used

- 🐍 Python (Flask)
- 🌐 JavaScript (Tampermonkey user script)
- 📳 Telegram Bot API
- 📲 Pushover API
- 🔁 Automation + Notification

---

## 📦 Requirements

### ✅ Python Packages

Install all dependencies:

```bash
pip install -r requirements.txt
````

**`requirements.txt`:**

```
flask
flask-cors
pyjwt
requests
cryptography
```

---

## ⚙️ How To Use

### 1. 💬 Setup the Telegram Bot

* Open Telegram → [@BotFather](https://t.me/BotFather)
* Use `/newbot` to create your bot and get the **Bot Token**
* Get your Chat ID via [@username\_to\_id\_bot](https://t.me/username_to_id_bot)

### 2. 🧪 Install Tampermonkey Extension

> Tampermonkey allows you to run custom scripts in your browser.

* **Chrome**: [Install from Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en&pli=1)
* **Firefox**: [Install from Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

### 3. 📜 Add and Configure User Script

1. Click Tampermonkey icon → Create New Script
2. Paste `script_js_extension.txt`
3. Replace:

   * `telegramBotToken = 'YOUR_BOT_TOKEN'`
   * `telegramChatId = 'YOUR_CHAT_ID'`
   * `email = 'YOUR_EMAIL'`
   * `password = 'YOUR_PASSWORD'`

### 4. 🔔 Run the Alarm Server

Run this Flask server locally to send alarm notifications via [Pushover](https://pushover.net):

```bash
python pool.py
```

Server Endpoints:

* `GET /start`: Starts alarm thread
* `GET /stop`: Stops alarm thread

---

## 🔔 Notifications

* **When pool MAY be available**:

  * Telegram: `🔔 Pool MAY be available!`
  * Flask server: starts looping alarm via Pushover

* **When pool is NOT available**:

  * Stops alarm if it was running
  * Auto-refresh continues

---

## 📁 File Structure

```
📁 pool-alarm-1337/
├── pool.py            # Flask server (alarm logic)
├── script_js_extension.txt  # Tampermonkey automation script
├── requirements.txt            # Python package requirements
├── README.md                   # Full project documentation
```

---

## 🧠 Tips & Warnings

* ⚠️ **Never commit your credentials or bot tokens publicly.**
* You can run the Flask server in background while browsing.
* Make sure your machine allows requests to `http://127.0.0.1:5000`.

---

## 👤 Author

**Nouredine Kn  (delone)**
📍 GitHub: [github.com/nouredinekn](https://github.com/nouredinekn)
📍 website: [developpeurcasablanca.com](https://developpeurcasablanca.com)


