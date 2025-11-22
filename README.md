# 🛡️ PrivacyShield

**The Open-Source "Privacy Firewall" for AI Development.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web_Store-blue)](YOUR_LINK_HERE)
[![Privacy](https://img.shields.io/badge/Privacy-Local_Only-green)]()

## 🚨 The Problem
Every day, developers accidentally paste **API Keys**, **Client Emails**, and **Database IPs** into LLMs like ChatGPT, Claude, or Gemini. 
Once you paste it, it's on their servers. This violates GDPR, SOC2, and NDAs.

## 💡 The Solution
**PrivacyShield** is a lightweight Chrome Extension that sits between your clipboard and the AI.
1. **Scrub:** It replaces sensitive data with placeholders (e.g., `sk-123` → `{{API_KEY_1}}`).
2. **Safe Paste:** You send the anonymized code to the AI.
3. **Restore:** When the AI fixes your code, PrivacyShield swaps the placeholders back to the real values instantly.

**Zero Data Leaves Your Device.** All processing happens locally in your browser.

## ✨ Features

- **🔒 Zero-Knowledge Architecture:** No servers. No analytics. Your secrets never leave `localStorage`.
- **🧠 Entropy Detection:** Uses Shannon Entropy math to detect passwords and keys that don't match standard Regex patterns.
- **⚡ Two-Way Sync:** Unlike other tools that just "mask" data, we restore it so your code remains executable.
- **📝 Custom Rules:** Add your own project names (e.g., "Project Apollo") to the redaction list.
- **📂 File Support:** (Coming Soon) Drag & drop `.log` and `.csv` files to scrub them in bulk.

## 🚀 Quick Start

### Method 1: Install from Chrome Web Store
[Link to Chrome Store](YOUR_LINK_HERE) _(Pending Review)_

### Method 2: Run Locally (For Developers)
1. Clone the repo
   ```bash
   git clone [https://github.com/YOUR_USERNAME/privacy-shield.git](https://github.com/BhlHk/privacy-shield.git)
   cd privacy-shield