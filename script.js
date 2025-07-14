const questions = [
  "どのようなホームページ制作をご依頼されましたか？",
  "弊社を選んでいただいた理由を教えてください。",
  "制作の進行中、スタッフの対応はいかがでしたか？",
  "ホームページの仕上がりについてどう感じましたか？",
  "特に満足いただけたポイントはどこでしたか？",
  "逆に、改善してほしい点やご要望があれば教えてください。",
  "公開後の効果や反響について感じたことはありますか？",
  "サポート対応や運用のしやすさはいかがですか？",
  "他社と比較して、弊社の良かった点があれば教えてください。",
  "このサービスはどんな方・企業におすすめしたいですか？"
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
