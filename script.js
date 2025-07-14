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
    questionContainer.style.display = "none";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    resultContainer.style.display = "block";

    const prompt = "以下の質問と回答から、自然で丁寧なGoogleクチコミ文を1つ作ってください：\n" +
      questions.map((q, i) => `${q} 回答：${answers[i]}`).join("\n");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) throw new Error("APIエラー");

      const data = await res.text(); // ← Edge FunctionはJSON返してないので text() に変更
      reviewText.value = data;
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
