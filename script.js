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
const reviewLink = document.getElementById("reviewLink"); // 完了画面のリンク
const reviewLinkBelow = document.getElementById("reviewLinkBelow"); // 文章案画面のリンク

const questionContainer = document.getElementById("question-container");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// URLパラメータ取得
const params = new URLSearchParams(window.location.search);
const placeId = params.get("place") || "CciW4fD4jwcoEBM"; // デフォルトplace_id
const shopName = params.get("shop") || "キキコミハウスクリーニング"; // デフォルト屋号名

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

// スタート画面から質問へ遷移
startBtn.onclick = () => {
  startScreen.style.display = "none";
  questionScreen.style.display = "block";
  renderQuestion();
};

// 質問の描画
function renderQuestion() {
  questionContainer.innerHTML = `
    <p>Q${current + 1}. ${questions[current]}</p>
    <textarea id="answer" placeholder="ここにご回答を入力してください">${answers[current]}</textarea>
    <p>${current + 1} / ${questions.length}問</p>
  `;
  prevBtn.style.display = current === 0 ? "none" : "inline-block";
  nextBtn.textContent = current === questions.length - 1 ? "完了" : "次へ";
}

// 前の質問へ
prevBtn.onclick = () => {
  answers[current] = document.getElementById("answer").value;
  if (current > 0) current--;
  renderQuestion();
};

// 次の質問 or 完了
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
    updateGoogleLinks();
  }
};

// クチコミ文章案を見る
viewDraftBtn.onclick = () => {
  completeScreen.style.display = "none";
  reviewScreen.style.display = "block";

  // 仮のクチコミ文章案（必要なら shopName を使って動的生成も可能）
  let content =
    "ご依頼いただいたホームページ制作について、丁寧に対応していただき、とても満足しています。スタッフの方の対応も親切で、納得のいく仕上がりとなりました。今後もサポートを期待しています。";

  reviewText.value = content;
  charCount.textContent = content.length;
  updateGoogleLinks();
};

// Googleクチコミリンクを更新する
function updateGoogleLinks() {
  const googleUrl = `https://g.page/r/${placeId}/review`;
  if (reviewLink) reviewLink.href = googleUrl;
  if (reviewLinkBelow) reviewLinkBelow.href = googleUrl;
}

// 屋号名を画面内に反映する
function setShopName() {
  const titleEls = document.querySelectorAll(".brand-title");
  titleEls.forEach(el => {
    el.textContent = shopName;
  });
}

// 初期化
document.addEventListener("DOMContentLoaded", () => {
  updateGoogleLinks();
  setShopName();
});
