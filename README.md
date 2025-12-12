
# 🌍 Universal AI Gateway (HK Edition) | 通用 AI 網關 (香港版)

**[English Version Below]**

這是一個基於 Serverless 架構的 API 網關，專為解決 Google Gemini 及 Cerebras 等頂尖 AI 模型在特定地區（如香港）的地理限制問題而設計。

本專案提供了一個 **完全兼容 OpenAI 格式** 的 API 接口，讓你無需 VPN 即可在任何應用程式、腳本或網頁中調用最新的推理模型。

---

## ✨ 功能特色 (Features)

*   **突破地理限制 (Geo-Unblocking):** 利用 Vercel 美國節點進行請求轉發，繞過 IP 封鎖。
*   **OpenAI 兼容 (OpenAI Compatibility):** 可直接使用標準的 OpenAI SDK (Python, Node.js) 或任何支援 OpenAI 的客戶端。
*   **智能路由 (Smart Routing):** 自動識別模型名稱，將請求分流至 Google 或 Cerebras。
*   **私密安全 (Private & Secure):** 透過自訂的 `ALLOWED_KEYS` (Bearer Token) 進行存取控制。
*   **教學資源:** 內附教學筆記，適合師生學習用途。

---

## 🧠 模型支援與路由邏輯 (Model Support & Logic)

本網關採用 **動態路由 (Dynamic Routing)** 機制。你無需更新後端代碼即可使用供應商推出的新模型。

*   **判斷邏輯:** 系統會讀取請求中的 `model` 參數。
    *   若名稱包含 `gemini` (例如 `gemini-2.5-pro`) ➡️ **轉發至 Google API**。
    *   其他所有名稱 (例如 `llama-3.3-70b`) ➡️ **轉發至 Cerebras API**。

### 常用模型列表 (Common Model List)
*所有模型地位均等，請根據你的需求（速度、推理能力、上下文長度）選擇。*

| 供應商 (Provider) | 模型 ID (Model ID) | 備註 |
| :--- | :--- | :--- |
| **Google** | `gemini-2.5-flash` | 快速、低延遲 |
| **Google** | `gemini-2.5-pro` | 強大的推理能力 |
| **Google** | `gemini-flash-lite-latest` | 輕量級版本 |
| **Cerebras** | `llama-3.3-70b` | Meta 最新開源模型 |
| **Cerebras** | `llama3.1-8b` | 極速小型模型 |
| **Cerebras** | `qwen-3-235b-a22b-instruct-2507` | 235B 巨型參數模型 |
| **Cerebras** | `qwen-3-32b` | 通義千問中型模型 |
| **Cerebras** | `gpt-oss-120b` | 強大的開源 GPT |
| **Cerebras** | `zai-glm-4.6` | 智譜 GLM 模型 |

> 📚 **官方文檔:**
> *   [Google Gemini API Docs](https://ai.google.dev/gemini-api/docs)
> *   [Cerebras Inference Docs](https://inference-docs.cerebras.ai/introduction)

---

## 💻 代碼範例 (Code Demos)

**API Base URL:** `https://hugo-api-v1.vercel.app/api/v1`
**API Key:** 請輸入你的自訂密碼 (由 `ALLOWED_KEYS` 設定)

### 1. Python
```python
from openai import OpenAI

client = OpenAI(
    base_url="https://hugo-api-v1.vercel.app/api/v1",
    api_key="你的自訂密碼"
)

response = client.chat.completions.create(
    model="gemini-2.5-pro", # 或換成 llama-3.3-70b
    messages=[
        {"role": "user", "content": "解釋一下量子力學"}
    ]
)

print(response.choices[0].message.content)
```

### 2. cURL (Terminal)
```bash
curl https://hugo-api-v1.vercel.app/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 你的自訂密碼" \
  -d '{
    "model": "llama-3.3-70b",
    "messages": [{"role": "user", "content": "Hello World!"}]
  }'
```

### 3. JavaScript / Node.js
```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://hugo-api-v1.vercel.app/api/v1",
  apiKey: "你的自訂密碼"
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "寫一首關於 AI 的詩" }],
    model: "qwen-3-32b",
  });

  console.log(completion.choices[0].message.content);
}

main();
```

---

## 🎓 教育資源 (Education)

本專案包含一份專為學生設計的教學筆記，講解反向代理原理及部署流程。
*   **閱讀筆記:** [Education/Note.md](Education/Note.md)

---

## 📬 聯絡方式 (Contact)

如有任何問題、Bug 回報或授權通知，請透過以下方式聯絡：
*   **Email:** whugo9528@yahoo.com
*   **GitHub Issues:** 在此儲存庫提交 Issue

---
---

# 🇺🇸 English Version

This is a Serverless API Gateway designed to bypass geo-restrictions (e.g., in Hong Kong) for top-tier AI models like Google Gemini and Cerebras.

This project provides an **OpenAI-compatible API endpoint**, allowing you to access the latest inference models from any application, script, or website without needing a VPN.

---

## ✨ Features

*   **Geo-Unblocking:** Proxies requests through Vercel's US nodes to bypass IP blocking.
*   **OpenAI Compatibility:** Works seamlessly with standard OpenAI SDKs (Python, Node.js) and clients.
*   **Smart Routing:** Automatically detects the model name and routes the request to either Google or Cerebras.
*   **Private & Secure:** Access is protected via custom `ALLOWED_KEYS` (Bearer Tokens).
*   **Educational Resources:** Includes teaching notes suitable for students and teachers.

---

## 🧠 Model Support & Logic

The gateway uses a **Dynamic Routing** mechanism. You can use new models released by providers without updating the backend code.

*   **Routing Logic:** The system inspects the `model` parameter in your request.
    *   If the name contains `gemini` (e.g., `gemini-2.5-pro`) ➡️ **Routes to Google API**.
    *   All other names (e.g., `llama-3.3-70b`) ➡️ **Routes to Cerebras API**.

### Common Model List
*All models are treated equally. Choose based on your needs (speed, reasoning, context).*

| Provider | Model ID | Note |
| :--- | :--- | :--- |
| **Google** | `gemini-2.5-flash` | Fast, low latency |
| **Google** | `gemini-2.5-pro` | Strong reasoning capability |
| **Google** | `gemini-flash-lite-latest` | Lightweight version |
| **Cerebras** | `llama-3.3-70b` | Latest open-source model by Meta |
| **Cerebras** | `llama3.1-8b` | Extremely fast small model |
| **Cerebras** | `qwen-3-235b-a22b-instruct-2507` | Massive 235B parameter model |
| **Cerebras** | `qwen-3-32b` | Qwen medium model |
| **Cerebras** | `gpt-oss-120b` | Powerful open-source GPT |
| **Cerebras** | `zai-glm-4.6` | Zhipu GLM model |

> 📚 **Official Documentation:**
> *   [Google Gemini API Docs](https://ai.google.dev/gemini-api/docs)
> *   [Cerebras Inference Docs](https://inference-docs.cerebras.ai/introduction)

---

## 💻 Code Demos

**API Base URL:** `https://hugo-api-v1.vercel.app/api/v1`
**API Key:** Enter your custom password (configured in `ALLOWED_KEYS`)

### 1. Python
```python
from openai import OpenAI

client = OpenAI(
    base_url="https://hugo-api-v1.vercel.app/api/v1",
    api_key="YOUR_CUSTOM_PASSWORD"
)

response = client.chat.completions.create(
    model="gemini-2.5-pro", # or llama-3.3-70b
    messages=[
        {"role": "user", "content": "Explain quantum mechanics"}
    ]
)

print(response.choices[0].message.content)
```

### 2. cURL (Terminal)
```bash
curl https://hugo-api-v1.vercel.app/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CUSTOM_PASSWORD" \
  -d '{
    "model": "llama-3.3-70b",
    "messages": [{"role": "user", "content": "Hello World!"}]
  }'
```

### 3. JavaScript / Node.js
```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://hugo-api-v1.vercel.app/api/v1",
  apiKey: "YOUR_CUSTOM_PASSWORD"
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Write a poem about AI" }],
    model: "qwen-3-32b",
  });

  console.log(completion.choices[0].message.content);
}

main();
```

---

## 🎓 Education

This project includes teaching notes designed for students, explaining the principles of reverse proxies and the deployment process.
*   **Teaching Notes:** [Education/Note.md](Education/Note.md)

---

## 📬 Contact

For any questions, bug reports, or license notifications, please contact via:
*   **Email:** whugo9528@yahoo.com
*   **GitHub Issues:** Submit an issue in this repository.

---

## 📜 License

This project is licensed under a **Modified MIT License** with a strict Notification Requirement.

**Copyright (c) 2025 Hugo Wong**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

1.  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

2.  **ATTRIBUTION REQUIREMENT:** Any redistribution, fork, or deployment of this software (whether in source or binary form) must explicitly credit the original author "**Hugo Wong**" in the documentation, "About" section, or footer of the derived work.

3.  **NOTIFICATION REQUIREMENT:** If this software is deployed for public use or used as part of a public-facing service, the user is required to notify the copyright holder (Hugo Wong) via provided contact channels (Email: whugo9528@yahoo.com).

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
