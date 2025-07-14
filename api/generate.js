export default async function handler(req, res) {
  const { prompt } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "APIキーが設定されていません。" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "あなたは親しみやすく丁寧なGoogleクチコミ文を生成するアシスタントです。" },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "生成に失敗しました。";
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "APIエラー: " + error.message });
  }
}
