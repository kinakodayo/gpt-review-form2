// スタート画面の表示制御（追加）
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");

startBtn.onclick = () => {
  startScreen.style.display = "none";
  questionScreen.style.display = "block";
};

// アンケート処理
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

function renderQuestion() {
  questionContainer.innerHTML = `
    <p>Q${current + 1}. ${questions[current]}</p>
    <textarea id="answer">${answers[current]}</textarea>
    <p style="font-size: 12px; color: gray;">${current + 1} / ${questions.length}問</p>
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
    alert("アンケートが完了しました。");
    console.log("回答:", answers);
    // ここにGPT送信処理などを後で追加できます
  }
};
