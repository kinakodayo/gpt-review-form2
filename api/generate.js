// api/generate.js

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Edge Runtimeでは baseURL を明示しないとエラーになることがある
  const url = new URL(req.url, 'http://localhost');

  const name = url.searchParams.get("name") || "ゲスト";

  return new Response(`こんにちは、${name}さん！`, {
    headers: { "Content-Type": "text/plain" }
  });
}
