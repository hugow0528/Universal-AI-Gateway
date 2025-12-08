這是一個非常好的想法！你想做的是一個 **「Private AI Gateway」 (私有 AI 網關)**。

這樣做的好處是：
1.  **一次部署，到處使用：** 你寫 Python 腳本、做網頁、寫 App，甚至俾朋友用，全部指住同一個 API URL 就得。
2.  **集中管理 Key：** 你的朋友唔需要知你的 Gemini/Cerebras API Key，你只需要俾一個自訂密碼（Access Token）佢哋。
3.  **完美偽裝：** 繼續利用 Vercel 美國節點破解地區限制。

以下係完整的 **API Service 方案**，包含部署代碼同埋一份詳細的 **Documentation** 俾你同朋友用。

---

### 🚀 第一部分：部署代碼 (Deployment)

你需要開一個新嘅 GitHub Repo，然後放入以下三個檔案。

#### 1. `vercel.json` (強制美國 IP)
同之前一樣，這是核心，必須鎖死在美國東岸 (`iad1`)。

```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 60,
      "memory": 1024
    }
  },
  "regions": ["iad1"]
}
```

#### 2. `package.json`
```json
{
  "name": "hk-ai-gateway",
  "version": "1.0.0",
  "dependencies": {}
}
```

#### 3. `api/v1/chat/completions.js` (API 核心邏輯)
我將路徑設定為 `api/v1/chat/completions`，這是 **OpenAI 標準路徑**，方便你直接用 LangChain 或其他 OpenAI SDK 接入。

```javascript
// api/v1/chat/completions.js

export const config = {
  runtime: 'nodejs', // 使用標準 Node.js 以配合 vercel.json 的地區鎖定
};

export default async function handler(req, res) {
  // 1. 只容許 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method Not Allowed', type: 'invalid_request_error' } });
  }

  // 2. 驗證密碼 (Bearer Token)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'Missing or invalid Authorization header', type: 'authentication_error' } });
  }

  const userToken = authHeader.split(' ')[1];
  // 在 Vercel 環境變數設定 ALLOWED_KEYS="pass1,pass2,pass3" (用逗號分隔)
  const allowedKeys = (process.env.ALLOWED_KEYS || '').split(',');
  
  if (!allowedKeys.includes(userToken)) {
    return res.status(401).json({ error: { message: 'Invalid API Key (Access Denied)', type: 'authentication_error' } });
  }

  try {
    const { model, messages, stream, ...otherParams } = req.body;

    // 3. 路由選擇 (Routing)
    let targetUrl = '';
    let apiKey = '';
    let extraHeaders = {};
    let extraBody = {};

    if (model.startsWith('gemini')) {
      // --- Google Gemini (OpenAI Compatibility) ---
      targetUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
      apiKey = process.env.GEMINI_API_KEY;
      
      // Gemini 3 Pro 特殊優化
      if (model.includes('gemini-3')) {
        extraBody.reasoning_effort = "high"; 
      }
    } else {
      // --- Cerebras ---
      targetUrl = "https://api.cerebras.ai/v1/chat/completions";
      apiKey = process.env.CEREBRAS_API_KEY;
      // 偽裝 Header 避開 Cloudflare
      extraHeaders['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    }

    // 4. 轉發請求
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...extraHeaders
      },
      body: JSON.stringify({
        model,
        messages,
        stream: stream || false, // 暫時只支援非串流 (簡單啲)，如需串流要改寫 Response Handling
        ...otherParams,
        ...extraBody
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Upstream Error (${model}):`, errorText);
      return res.status(response.status).json({ 
        error: { 
          message: `Upstream API Error: ${response.statusText}`, 
          details: errorText,
          type: 'upstream_error' 
        } 
      });
    }

    const data = await response.json();
    
    // 5. 回傳標準 OpenAI 格式
    return res.status(200).json(data);

  } catch (error) {
    console.error('Gateway Error:', error);
    return res.status(500).json({ error: { message: 'Internal Server Error', type: 'server_error', details: error.message } });
  }
}
```

---

### ⚙️ Vercel 設定指南

1.  部署到 Vercel 後，進入 **Settings** -> **Environment Variables**。
2.  加入以下變數：

| Key | Value (範例) | 說明 |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `AIzaSy...` | 你的 Google 真實 Key |
| `CEREBRAS_API_KEY` | `csk-...` | 你的 Cerebras 真實 Key |
| `ALLOWED_KEYS` | `friend1,vip_user,my_secret_pass` | **自訂密碼列表**，用逗號分隔。你俾朋友就俾 `friend1` 佢。 |

---

### 📄 第二部分：API Documentation (俾你同朋友用)

你可以將以下內容 Copy 做一個 `README.md` 或者直接 Send 俾你朋友。

***

# 🌍 Universal AI Gateway (HK Edition)

這是一個私有的 AI API 網關，讓你可以在香港（或任何地區）直接調用最新的 Gemini 和 Cerebras 模型，無需 VPN。此接口完全兼容 **OpenAI SDK**。

## 🔑 認證 (Authentication)
使用 **Bearer Token** 進行認證。請向管理員索取你的專屬 API Key（密碼）。

## 🌐 Base URL
```
https://你的-vercel-專案名.vercel.app/api/v1
```

## 🧠 支援模型 (Supported Models)

| Provider | Model ID | 簡介 |
| :--- | :--- | :--- |
| **Google** | `gemini-3-pro-preview` | **最強推介**。最新一代推理模型，極高智商。 |
| **Google** | `gemini-2.5-pro` | 穩定、強大的通用模型。 |
| **Cerebras** | `llama-3.3-70b` | Meta 最新開源模型，Cerebras 加速，速度極快。 |
| **Cerebras** | `llama3.1-8b` | 輕量級快速模型。 |
| **Cerebras** | `qwen-3-235b-a22b-instruct-2507` | Qwen (通義千問) 235B 巨型模型。 |
| **Cerebras** | `qwen-3-32b` | Qwen 中型模型。 |
| **Cerebras** | `gpt-oss-120b` | 強大的開源 GPT 模型。 |
| **Cerebras** | `zai-glm-4.6` | Zhipu GLM 4.6 模型。 |

---

## 💻 使用範例 (Code Examples)

### 1. Python (使用官方 OpenAI 庫)
這是最簡單的方法，將你的 Gateway 當作 OpenAI 來用。

```python
from openai import OpenAI

# 設定你的 Gateway 地址和密碼
client = OpenAI(
    base_url="https://你的-vercel-專案名.vercel.app/api/v1",
    api_key="你的_自訂_密碼"  # 例如: friend1
)

response = client.chat.completions.create(
    model="gemini-3-pro-preview", # 或 llama-3.3-70b
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello! 介紹一下你自己。"}
    ]
)

print(response.choices[0].message.content)
```

### 2. cURL (Command Line)
```bash
curl https://你的-vercel-專案名.vercel.app/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 你的_自訂_密碼" \
  -d '{
    "model": "llama-3.3-70b",
    "messages": [{"role": "user", "content": "寫一首關於香港的短詩"}]
  }'
```

### 3. JavaScript / Node.js
```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://你的-vercel-專案名.vercel.app/api/v1",
  apiKey: "你的_自訂_密碼"
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Gemini, 你好嗎？" }],
    model: "gemini-3-pro-preview",
  });

  console.log(completion.choices[0].message.content);
}

main();
```

---

### ⚠️ 注意事項
1.  **私用性質：** 請勿將此 API 公開分享到網上論壇，以免額度被耗盡或被封鎖。
2.  **安全性：** 請妥善保管你的密碼。
3.  **速度：** 由於經過了美國轉發，會有輕微的網絡延遲，但能保證連通性。

***