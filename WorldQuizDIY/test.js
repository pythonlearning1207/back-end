var currentQuiz = {};
const quiz = [
    { country: "China", capital: "Beijing"},
    { country: "Japan", capital: "Tokyo"},
    { country: "France", capital: "Paris"},
]

function nextQuizs() {
    const nextQuiz = quiz[Math.floor(Math.random()* quiz.length)]
    currentQuiz = nextQuiz;
}

nextQuizs();
console.log(currentQuiz);