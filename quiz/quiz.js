const questions = [
  {
    flag: "https://flagcdn.com/ph.svg",
    answer: "Philippines",
    options: ["Philippines", "Japan", "Brazil", "France"]
  },
  {
    flag: "https://flagcdn.com/jp.svg",
    answer: "Japan",
    options: ["China", "Japan", "South Korea", "Thailand"]
  }
  // Add more questions here
];

let current = 0;
let score = 0;

const questionDiv = document.getElementById("question");
const optionsDiv = document.getElementById("options");
const nextBtn = document.getElementById("next");
const scoreDiv = document.getElementById("score");

function loadQuestion() {
  const q = questions[current];
  questionDiv.innerHTML = `<img src="${q.flag}" alt="Flag" width="150">`;
  optionsDiv.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected) {
  if (selected === questions[current].answer) {
    score++;
  }
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  current++;
  if (current < questions.length) {
    loadQuestion();
    nextBtn.disabled = true;
  } else {
    questionDiv.innerHTML = "Quiz Finished!";
    optionsDiv.innerHTML = "";
    scoreDiv.innerHTML = `Your score: ${score}/${questions.length}`;
    nextBtn.style.display = "none";
  }
});

// Initialize
loadQuestion();
nextBtn.disabled = true;