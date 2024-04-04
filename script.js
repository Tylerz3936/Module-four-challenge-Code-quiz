const startButton = document.getElementById('start-btn');
const highScoresLink = document.getElementById('high-scores-link');
const timerDisplay = document.getElementById('time');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
let shuffledQuestions, currentQuestionIndex;
let quizTimer = 75; 
let timerId;

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('clear-high-scores').addEventListener('click', clearHighScores);
document.getElementById('go-back').addEventListener('click', goBack);

function startGame() {
  //resets timer at beginning
  quizTimer=75;
  document.getElementById('start-btn').classList.add('hide');
  // Other elements hidden at start
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  document.getElementById('question-container').classList.remove('hide');
  setNextQuestion();
  startTimer();
}


function startTimer() {
    timerId = setInterval(() => {
      quizTimer--;
      timerDisplay.textContent = quizTimer;
      if (quizTimer <= 0) {
        endGame();
      }
    }, 1000);
  }
  

function setNextQuestion() {
    if (currentQuestionIndex >= shuffledQuestions.length) {
        endGame(); // End the game if there are no more questions
      } else {
        resetState();
        showQuestion(shuffledQuestions[currentQuestionIndex]);
      }
}

function showQuestion(question) {
  questionElement.textContent = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}
const feedbackElement = document.getElementById('feedback'); 
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    
    // Check if the selected answer is correct and provide feedback
    if (correct) {
      displayFeedback(true);
    } else {
      // If the answer is incorrect, deduct time as a penalty and provide feedback
      quizTimer -= 10;
      if (quizTimer < 0) {
        quizTimer = 0;
      }
      displayFeedback(false);
    }
    timerDisplay.textContent = quizTimer;
  
    // After a short delay for the feedback, either set the next question or end the game
    setTimeout(() => {
      if (shuffledQuestions.length > currentQuestionIndex + 1) {
        currentQuestionIndex++;
        setNextQuestion();
      } else {
        endGame();
      }
    }, 1000); 
  }

  function displayFeedback(isCorrect) {
    feedbackElement.textContent = isCorrect ? 'Correct!' : 'Wrong!';
    feedbackElement.className = 'feedback'; 
    feedbackElement.classList.add(isCorrect ? 'correct-feedback' : 'wrong-feedback');
    
    // Hide the feedback after a delay
    setTimeout(() => {
      feedbackElement.textContent = '';
      feedbackElement.className = 'feedback'; // Reset the classes
    }, 1000);
  }
function endGame() {
    clearInterval(timerId); // Clear the interval to stop the timer
    questionContainerElement.classList.add('hide'); // Hide question container
    document.getElementById('intro-section').classList.add('hide');
    const endScreen = document.getElementById('end-screen');
    endScreen.style.display = 'flex';
    document.getElementById('final-score').textContent = quizTimer; // Display final score
}
  
  function saveHighScore(score, initials) {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const newScore = { score, initials };
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    showHighScoresScreen(); // Call this function here after saving the score
}
  

  document.getElementById('submit-score').addEventListener('click', function() {
    const initials = document.getElementById('initials').value;
    if (initials) {
      saveHighScore(quizTimer, initials);
    } else {
      alert('Please enter your initials.');
    }
  });
  
function showHighScoresScreen() {
    // Hide all other sections
    questionContainerElement.classList.add('hide'); // Hide question container
    document.getElementById('intro-section').classList.add('hide');
    const endScreen = document.getElementById('end-screen');
    endScreen.style.display = 'none';

    // Show the high scores screen
    const highScoresScreen = document.getElementById('high-scores-screen');
    highScoresScreen.classList.remove('hide');

    // Update the high scores list
    const highScoresList = document.getElementById('high-scores-list');
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScoresList.innerHTML = highScores.map((score, index) => 
        `<li>${index + 1}. ${score.initials} - ${score.score}</li>`
    ).join('');
}

function clearHighScores() {
    localStorage.removeItem('highScores');
    showHighScoresScreen(); // Refresh the list
}

function goBack() {
    // Hide high scores screen
    document.getElementById('high-scores-screen').classList.add('hide');
    // Show the start screen
    document.getElementById('intro-section').classList.remove('hide');
    document.getElementById('start-btn').classList.remove('hide');
}

//questions
const questions = [
    {
        question: 'What is 2 + 2?',
        answers: [
        { text: '4', correct: true },
        { text: '22', correct: false },
        { text: 'An undefined value', correct: false },
        { text: 'A string', correct: false }
        ]
    },
    {
        question: 'Which symbol is used for comments in JavaScript?',
        answers: [
        { text: '/* */', correct: false },
        { text: '//', correct: true },
        { text: '<!-- -->', correct: false },
        { text: '#', correct: false }
        ]
    },
    {
        question: 'How do you declare a JavaScript variable?',
        answers: [
        { text: 'var myVar', correct: true },
        { text: 'variable myVar', correct: false },
        { text: 'v myVar', correct: false },
        { text: 'let myVar', correct: true } 
        ]
    },

    {
        question: 'How do you call a function named "myFunction"?',
        answers: [
        { text: 'call function myFunction()', correct: false },
        { text: 'call myFunction()', correct: false },
        { text: 'myFunction()', correct: true },
        { text: 'execute myFunction()', correct: false }
        ]
    },
    {
        question: 'How to write an IF statement in JavaScript?',
        answers: [
        { text: 'if i = 5', correct: false },
        { text: 'if i == 5 then', correct: false },
        { text: 'if (i == 5)', correct: true },
        { text: 'if i = 5 then', correct: false }
        ]
    },
    {
        question: 'How does a FOR loop start?',
        answers: [
        { text: 'for (i = 0; i <= 5; i++)', correct: true },
        { text: 'for (i <= 5; i++)', correct: false },
        { text: 'for i = 1 to 5', correct: false },
        { text: 'for (i = 0; i <= 5)', correct: false }
        ]
    },
    {
        question: 'How can you add a comment in a JavaScript?',
        answers: [
        { text: 'This is a comment', correct: false },
        { text: '/* This is a comment */', correct: true },
        { text: '// This is a comment', correct: true },
        { text: '<!-- This is a comment -->', correct: false }
        ]
    },
    {
        question: 'What is the correct way to write a JavaScript array?',
        answers: [
        { text: 'var colors = "red", "green", "blue"', correct: false },
        { text: 'var colors = ["red", "green", "blue"]', correct: true },
        { text: 'var colors = (1:"red", 2:"green", 3:"blue")', correct: false },
        { text: 'var colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")', correct: false }
        ]
    }
    ];
    
