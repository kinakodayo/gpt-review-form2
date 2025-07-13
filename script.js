const questions = [
  "どんなサービスを利用しましたか？",
  "どんな点が良かったですか？",
  "スタッフの対応はいかがでしたか？",
  "お店の雰囲気はどう感じましたか？",
  "今回の利用目的は？",
  "印象に残ったことはありますか？",
  "他と比べて良かった点は？",
  "改善してほしい点はありますか？",
  "また来たいと思いますか？",
  "このお店はどんな人におすすめですか？"
];

let current = 0;
let answers = new Array(questions.length).fill("");

const questionContainer = document.getElementById("question-container");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resultContainer = document.getElementById("result-container");
const reviewText = document.getElementById("reviewText");
const postLink = document.getElementById("postLink");

function renderQuestion() {
  questionContainer.innerHTML = `
    <h2>質問 ${current + 1} / ${questions.length}</h2>
    <p>${questions[current]}</p>
    <textarea id="answer" rows="4">${answers[current]}</textarea>
  `;
  prevBtn.style.display = current === 0 ? "none" : "inline-block";
  nextBtn.textContent = current === questions.length - 1 ? "送信" : "次へ";
}

prevBtn.onclick = () => {
  answers[current] = document.getElementById("answer").value;
  current--;
  renderQuestion();
};

nextBtn.onclick = async () => {
  answers[current] = document.getElementById("answer").value;
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    // 送信・生成
    questionContainer.style.display = "none";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    resultContainer.style.display = "block";

    const prompt = "以下の質問と回答から、自然で丁寧なGoogleクチコミ文を1つ作ってください：\n" +
      questions.map((q, i) => `${q} 回答：${answers[i]}`).join("\n");

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8
        })
      });

      if (!res.ok) throw new Error("APIエラー");
      const data = await res.json();
      const result = data.choices?.[0]?.message?.content || "生成失敗しました。";
      reviewText.value = result;
    } catch (err) {
      reviewText.value = "生成失敗しました。エラー内容: " + err.message;
    }

    const placeId = new URLSearchParams(location.search).get("placeid") || "";
    postLink.href = `https://search.google.com/local/writereview?placeid=${placeId}`;
  }
};

document.getElementById("copyBtn").onclick = () => {
  reviewText.select();
  document.execCommand("copy");
  alert("コピーしました！");
};

renderQuestion();

const API_KEY = "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";
