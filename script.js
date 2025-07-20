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
const reviewLink = document.getElementById("reviewLink");
const reviewLinkBelow = document.getElementById("reviewLinkBelow");

const questionContainer = document.getElementById("question-container");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// URLパラメータ取得
const params = new URLSearchParams(window.location.search);
const shopParam = params.get("shop") || "default";
let placeId = params.get("place") || "CciW4fD4jwcoEBM";
let shopName = "キキコミハウスクリーニング";

// 質問と回答管理
let questions = [];
let answers = [];
let current = 0;

// JSON読み込み（非同期）
async function loadShopData(shopKey) {
  try {
    const res = await fetch(`data/${shopKey}.json`);
    if (!res.ok) throw new Error("JSON読み込み失敗");

    const data = await res.json();
    questions = data.questions || [];
    answers = new Array(questions.length).fill("");
    reviewText.value = data.review || "";
    shopName = data.brand || shopName;
    placeId = data.placeId || placeId;
  } catch (e) {
    console.error("ショップデータの読み込みに失敗：", e);
    questions = ["このサービスをどう思いましたか？"];
    answers = new Array(questions.length).fill("");
    reviewText.value = "丁寧な対応で満足しています。";
  }
}

// スタート画面から質問へ遷移
function activateStartButton() {
  startBtn.onclick = () => {
    startScreen.style.display = "none";
    questionScreen.style.display = "block";
    renderQuestion(); // ← この時点で questions はセット済み
  };
}

// 質問表示
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

// クチコミ案表示
viewDraftBtn.onclick = () => {
  completeScreen.style.display = "none";
  reviewScreen.style.display = "block";
  reviewText.value = reviewText.value || "丁寧な対応で満足しています。";
  charCount.textContent = reviewText.value.length;
  updateGoogleLinks();
};

// Googleクチコミリンク更新（コピー → 新しいタブで開く）
function updateGoogleLinks() {
  const url = `https://g.page/r/${placeId}/review`;

  const handleClick = (e) => {
    e.preventDefault(); // デフォルトリンク動作を止める
    const text = reviewText.value || "";
    navigator.clipboard.writeText(text).then(() => {
      console.log("クチコミ文案をコピーしました！");
      window.open(url, '_blank'); // 新しいタブで開く
    }).catch(err => {
      console.error("コピー失敗:", err);
      window.open(url, '_blank'); // 失敗してもリンクは開く
    });
  };

  if (reviewLink) {
    reviewLink.href = url;
    reviewLink.addEventListener("click", handleClick);
  }

  if (reviewLinkBelow) {
    reviewLinkBelow.href = url;
    reviewLinkBelow.addEventListener("click", handleClick);
  }
}

// 屋号名表示更新
function setShopName() {
  const titleEls = document.querySelectorAll(".brand-title");
  titleEls.forEach(el => {
    el.textContent = shopName;
  });
}

// 初期化
document.addEventListener("DOMContentLoaded", async () => {
  await loadShopData(shopParam);
  updateGoogleLinks();
  setShopName();
  activateStartButton(); // ← 読み込み完了後にボタン機能を有効化！
});
