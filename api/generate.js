// api/generate.js

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const body = await req.json(); // POSTされたJSONを読む
    const prompt = body.prompt || "内容がありません";

    // （仮）クチコミっぽく整形したダミー応答
    const result = `【自動生成クチコミ】\n${prompt.substring(0, 100)}...`;

    return new Response(result, {
      headers: { "Content-Type": "text/plain" }
    });
  } catch (err) {
    return new Response("エラー: JSONの読み込みに失敗しました", {
      status: 400,
      headers: { "Content-Type": "text/plain" }
    });
  }
}
