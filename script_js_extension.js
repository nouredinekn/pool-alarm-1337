// ==UserScript==
// @name         Auto Scroll + Auto Refresh + Telegram Notify (Pool Check)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Checks for loading state, waits 20s if loading, ensures 10s delay for content load, then checks for pool or logs in on 1337 Admission page
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const intervalInSeconds = 20;
    const scrollDelay = 500;
    const telegramBotToken = 'your token';
    const telegramChatId = 'your id';
    const loadingCheckDelay = 20000; // 20s delay for loading state
    const minimumContentLoadDelay = 10000; // 10s minimum delay for content load

    let scrollStep = window.innerHeight / 2;
    let currentPosition = 0;
    let notified = false;

    // Hardcoded credentials for login
    const email = 'your email';
    const password = 'your pass';

    // Function to simulate fast typing
    function simulateTyping(element, value) {
        console.log(`Filling ${element.name || element.type} with: ${value}`);
        element.focus();
        element.value = '';
        value.split('').forEach((char, i) => {
            setTimeout(() => {
                const keyCode = char.charCodeAt(0);
                element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: char, keyCode }));
                element.value += char;
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true, key: char, keyCode }));
                element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: char, keyCode }));
            }, i * 20);
        });
        setTimeout(() => {
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('blur', { bubbles: true }));
        }, value.length * 20 + 50);
    }

    // Function to perform form login
    function performFormLogin() {
        console.log('Attempting form login...');
        const emailField = document.querySelector('input[name="email"], input[type="email"], input[placeholder*="Email" i]');
        const passwordField = document.querySelector('input[name="password"], input[type="password"], input[placeholder*="Password" i]');
        const submitButton = document.querySelector('button[type="submit"]');
        const form = document.querySelector('form');

        console.log('Form:', form);
        console.log('Form action:', form?.action || 'No form action');
        console.log('Email field:', emailField);
        console.log('Password field:', passwordField);
        console.log('Submit button:', submitButton);

        if (emailField && passwordField && submitButton && form) {
            simulateTyping(emailField, email);
            setTimeout(() => simulateTyping(passwordField, password), email.length * 20 + 100);
            setTimeout(() => {
                console.log('Clicking submit button...');
                submitButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                setTimeout(() => {
                    console.log('Submitting form directly...');
                    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                    setTimeout(() => {
                        console.log('Attempting direct POST to /api/auth/login...');
                        fetch('https://admission.1337.ma/api/auth/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json, text/plain, */*',
                                'Origin': 'https://admission.1337.ma',
                                'Referer': 'https://admission.1337.ma/users/sign_in',
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0'
                            },
                            body: JSON.stringify({ email, password }),
                            credentials: 'include'
                        })
                        .then(res => res.json().then(data => {
                            console.log('Direct POST response:', res.status, data);
                            console.log('Reloading page...');
                            window.location.reload();
                        }))
                        .catch(err => {
                            console.error('Direct POST error:', err);
                            console.log('Reloading page despite error...');
                            window.location.reload();
                        });
                    }, 500);
                }, 300);
            }, (email.length + password.length) * 20 + 300);
        } else {
            console.error('Form elements not found. Aborting login attempt.');
            window.location.reload();
        }
    }

    function sendTelegramMessage(message) {
        const encodedMessage = encodeURIComponent(message);
        const telegramURL = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${encodedMessage}`;

        
        const alarm = 'http://127.0.0.1:5000/start';

        fetch(telegramURL)
            .then(response => console.log('📬 Telegram sent:', response.status))
            .catch(err => console.error('❌ Telegram error:', err));

        fetch(alarm)
            .then(response => console.log('alarm:', response.status))
            .catch(err => console.error('alarm:', err));

   
    }

    function isPageLoading() {
        // Check for loading indicators: "Loading..." text or spinning SVG
        const loadingText = document.querySelector('p.font-light.text-lg')?.textContent?.includes('Loading...');
        const spinningSvg = document.querySelector('svg.animate-spin');
        return loadingText || spinningSvg;
    }

function checkForTextInHTML() {
    const htmlContent = document.documentElement.innerHTML;
    const target = "Any available Pool will appear here";

    const found = htmlContent.includes(target);

    // Added 'captcha' keyword here
    const poolKeywordFound = ["REGISTER", "Tetouan", "Benguerrir", "Rabat", "captcha"].some(word =>
        htmlContent.toLowerCase().includes(word.toLowerCase())
    );

    if ((!found || poolKeywordFound) && !notified) {
        console.log("🟢 Pool MAY be available (text not found OR keyword found)");

        if (window.location.href === "https://admission.1337.ma/users/sign_in") {
            console.log('On login page, triggering performFormLogin...');
            performFormLogin();
        } else {
            notified = true;
            sendTelegramMessage(`🔔 Pool MAY be available!\nURL: ${window.location.href}`);
        }
    } else {
        const alars = 'http://127.0.0.1:5000/stop';
        fetch(alars)
            .then(response => console.log('stop:', response.status))
            .catch(err => console.error('stop:', err));

        console.log("❌ No pool: Found text -", target);
    }
}


    function scrollPage() {
        currentPosition += scrollStep;
        window.scrollTo(0, currentPosition);
    }

    function startScrollingThenRefresh() {
        const scrollInterval = setInterval(scrollPage, scrollDelay);

        // Check if page is loading
        const delay = isPageLoading() ? loadingCheckDelay : minimumContentLoadDelay;
        console.log(`Page ${isPageLoading() ? 'is loading, waiting 20s' : 'not loading, waiting 10s'} before checking...`);
        setTimeout(checkForTextInHTML, delay);

        setTimeout(() => {
            clearInterval(scrollInterval);
            location.reload();
        }, intervalInSeconds * 1000);
    }

    startScrollingThenRefresh();
})();
