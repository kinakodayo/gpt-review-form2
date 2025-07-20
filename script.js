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

// URLパラメータ
const params = new URLSearchParams(window.location.search);
const shopParam = params.get("shop") || "default";

let questions = [];
let answers = [];
let current = 0;
let reviewDraft = "";
let googlePlaceId = "";
let shopName = "";

// 初期化
document.addEventListener("DOMContentLoaded", async () => {
  await loadShopData(shopParam);
  answers = new Array(questions.length).fill("");
  setShopName();
  updateGoogleLinks();
});

// JSON読み込み
async function loadShopData(shop) {
  try {
    const res = await fetch(`data/${shop}.json`);
    const data = await res.json();
    questions = data.questions || [];
    reviewDraft = data.review || "";
    googlePlaceId = data.placeId || "";
    shopName = data.brand || "";
  } catch (e) {
    questions = ["質問の読み込みに失敗しました"];
    reviewDraft = "クチコミ文案の読み込みに失敗しました";
    googlePlaceId = "";
    shopName = shop;
  }
}

// スタート → 質問画面
startBtn.onclick = () => {
  startScreen.style.display = "none";
  questionScreen.style.display = "block";
  renderQuestion();
};

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

// 前の質問
prevBtn.onclick = () => {
  answers[current] = document.getElementById("answer").value;
  if (current > 0) current--;
  renderQuestion();
};

// 次の質問または完了
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
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit"
    });
    completeTime.textContent = `アンケート回答日時：${formatted}`;
    updateGoogleLinks();
  }
};

// クチコミ文章案表示
viewDraftBtn.onclick = () => {
  completeScreen.style.display = "none";
  reviewScreen.style.display = "block";
  reviewText.value = reviewDraft;
  charCount.textContent = reviewDraft.length;
  updateGoogleLinks();
};

// 屋号名表示
function setShopName() {
  document.querySelectorAll(".brand-title").forEach(el => {
    el.textContent = shopName;
  });
}

// Googleリンク更新
function updateGoogleLinks() {
  if (!googlePlaceId) return;
  const url = `https://g.page/r/${googlePlaceId}/review`;
  if (reviewLink) reviewLink.href = url;
  if (reviewLinkBelow) reviewLinkBelow.href = url;
}
