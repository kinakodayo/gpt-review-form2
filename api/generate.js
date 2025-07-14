export default async function handler(req, res) {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const bodyRaw = Buffer.concat(buffers).toString();
  const body = JSON.parse(bodyRaw);
  const prompt = body.prompt || "自然なクチコミ文を1つ作ってください";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "あなたはプロのライターです。以下の内容をもとに自然で丁寧な日本語のGoogleクチコミ文を1つ作成してください。"
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content || "生成に失敗しました";

  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(result);
}
