const question = document.querySelector("#question");
const nextbtn = document.querySelector(".nextBtn");
const choices = Array.from(document.getElementsByClassName("answerText"));
const choiceContainers = Array.from(document.getElementsByClassName("choice-container"));
const texts = document.querySelectorAll(".answerText");
const progressText = document.getElementById("progressText");
const progressbarfull = document.getElementById("progressbarfull");
const game = document.getElementById("game");
const hud = document.getElementById("hud");
const message  = document.getElementById("gameMessage");
const preloader = document.querySelector('#preloader');
let submitBtn = document.querySelector('#submit-btn');
let form = document.querySelector('#form');
let username = document.querySelector('#name');
let scoreDiv = document.querySelector('#scoreDiv');
let leaderboard = document.querySelector('#leaderboard');

const API_BASE_URL = 'https://atlas-security.up.railway.app';

let currentQuestion = {};
let acceptingQuestion = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

let fileName = "questions.json";

fetch(fileName)
  .then((res) => {
    return res.json();
  })
  .then((returned) => {
    questions = returned;
    startGame();
  })
  .catch((err) => {
    console.log(err);
  });

const correctplus = 10;
const maxQuestions = 10;

let getNewQuestion = () => {
  questionCounter++;
  progressText.innerText = `Question: ${questionCounter}/${maxQuestions}`;

  progressbarfull.style.width = `${(questionCounter / maxQuestions) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;
  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
    choice.disabled = false;
  });
  availableQuestions.splice(questionIndex, 1);
  acceptingQuestion = true;
  nextbtn.disabled = true;
  nextbtn.classList.add("btn-disabled");
  choices.forEach((choice) => {
    choice.parentElement.classList.remove("correct");
    choice.parentElement.classList.remove("wrong");
    choice.parentElement.classList.remove("disabled");
  });
};

let startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  message.classList.add("hidden");
  game.classList.remove("hidden");
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    answerChoice(e);
    nextbtn.disabled = false;
    nextbtn.classList.remove("btn-disabled");
  });
});

let answerChoice = (click) => {
  let selectedChoice = click.target;
  let correctChoice = document.querySelector(`#one${currentQuestion.answer}`);
  let selectedAnswer = selectedChoice.dataset.number;
  let Correct =
    selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
  choices.forEach((choice) => {
    choice.parentElement.classList.add("disabled");
    choice.disabled = true;
  });
  if (Correct === "correct") {
    score += correctplus;
    selectedChoice.parentElement.classList.add("correct");
  } else if (Correct === "incorrect") {
    selectedChoice.parentElement.classList.add("wrong");
    correctChoice.parentElement.classList.add("correct");
  }
};

const createScore = async (scoreData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(scoreData)
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();
    console.log('Score created:', data);
    return data;
    

  } catch (error) {
    console.error('Error:', error);
    throw error;
    // Handle errors (e.g., show error message)
  }
};

async function getScores() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/scores`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any additional headers here, e.g., authorization tokens
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Scores fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw error; // Re-throw the error if you want calling code to handle it
  }
}

nextbtn.addEventListener("click", () => {
  if (availableQuestions.length === 0 || questionCounter >= maxQuestions) {
    preloader.style.display = "flex";
    choiceContainers.forEach((choiceContainer) => {
      choiceContainer.classList.add("hidden");
    }) 
    question.style.display = "none";
    nextbtn.style.display = "none";
    hud.style.display = 'none';

    scoreDiv.style.display = "flex";
    preloader.style.display = "none";
  } else {
    getNewQuestion();
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  preloader.style.display = "flex";
  try {
    await createScore({ name: username.value, userscore: score}).then(data => {
    // Handle the response (e.g., update UI)
    if (score >= 10) {
      message.textContent = `Congratulations ${data.name}! You're a data expert with a score of ${data.userscore}!`;
    }
    else if (score > 0) {
      message.textContent = `Good job ${data.name}! You had a score of ${data.userscore}. Let's do some review and score even higher!`;
    }
    else {
      message.textContent = `Oh no ${data.name}! You definitely didn't study with a score of ${data.userscore}! Try again!`;
    }
    message.classList.remove("hidden");
    nextbtn.textContent = "Restart";
    preloader.style.display = "none";
    form.style.display = 'none';
    nextbtn.addEventListener("click", () => {
      location.reload();
    });

  })

   await getScores().then(data => {
  // Extract the scores array from the data

  
  // Sort the scores
  const sortedScores = data
    .sort((a, b) => b.userscore - a.userscore)
    .slice(0, 5)
    .map((score, index) => `<div> ${index + 1}. ${score.name} - ${score.userscore} </div>`)
    .join('');

  leaderboard.innerHTML = "<div> Top Scores </div>" + sortedScores;
})
  }
  catch (e) {
    console.log(e);
  }
  
  

})

