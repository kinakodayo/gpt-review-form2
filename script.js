// DOM取得
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const completeScreen = document.getElementById("complete-screen");
const completeTime = document.getElementById("complete-time");
const viewDraftBtn = document.getElementById("viewDraftBtn");
const reviewScreen = document.getElementById("review-screen");
const reviewText = document.getElementById("reviewText");
const charCount = document.getElementById("charCount");

// 質問管理
const questions = [
  "どのようなホームページ制作をご依頼されましたか？",
  "弊社を選んでいただいた理由を教えてください。",
  "制作の進行中、スタッフの対応はいかがでしたか？",
  "ホームページの仕上がりについてどう感じましたか？",
  "特に満足いただけたポイントはどこでしたか？",
  "改善してほしい点やご要望があれば教えてください。",
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

// 表示制御
startBtn.onclick = () => {
  startScreen.style.display = "none";
  questionScreen.style.display = "block";
};

function renderQuestion() {
  questionContainer.innerHTML = `
    <p>Q${current + 1}. ${questions[current]}</p>
    <textarea id="answer">${answers[current]}</textarea>
    <p>${current + 1} / ${questions.length}問</p>
  `;
  prevBtn.style.display = current === 0 ? "none" : "inline-block";
  nextBtn.textContent = current === questions.length - 1 ? "完了" : "次へ";
}

prevBtn.onclick = () => {
  answers[current] = document.getElementById("answer").value;
  if (current > 0) current--;
  renderQuestion();
};

nextBtn.onclick = () => {
  answers[current] = document.getElementById("answer").value;
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    questionScreen.style.display = "none";
    completeScreen.style.display = "block";

    const now = new Date();
    const formatted = now.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
    completeTime.textContent = `アンケート回答日時：${formatted}`;
  }
};

// クチコミ文章案を見るボタン
viewDraftBtn.onclick = () => {
  completeScreen.style.display = "none";
  reviewScreen.style.display = "block";
  // サンプル文章。GPT連携ならここで生成。
  const content = "回答いただいた内容からは、Googleマップのクチコミ文章を作成することができませんでした。アンケートへのご協力ありがとうございました。";
  reviewText.value = content;
  charCount.textContent = content.length;
};

renderQuestion();
