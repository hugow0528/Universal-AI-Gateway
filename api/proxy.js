export const config = {
  runtime: 'nodejs', // 使用 Node.js 配合 vercel.json 鎖定美國 IP
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    // Vercel 這次只負責接收指令，不負責思考
    const { targetUrl, apiKey, payload, headers } = req.body;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...headers // 例如 User-Agent
      },
      body: JSON.stringify(payload)
    });

    // 獲取原始回應
    const data = await response.json();
    
    // 將 HTTP 狀態碼和數據回傳給 PHP
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}