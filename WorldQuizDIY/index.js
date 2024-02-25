import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "Jia3202128",
    port: 5432
})
const app = express();
const port = 3000;
let quiz = [];

db.connect();
db.query("SELECT * FROM capitals", (err, res) => {
    if (err) {
        console.error("Error executing query", err.stack);
    } else {
        quiz = res.rows;
        console.log(quiz);
    }
    db.end();
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

let totalScore = 0;
let currentQuiz = {};

// '/'
app.get("/", async(req, res) => {
    totalScore = 0;
    await nextQuizs();
    console.log(quiz);
    res.render("index.ejs", {
        currentQuiz,
    })
})

// post
app.post("/submit", (req, res) => {
    let answer = req.body.answer.trim();
    let isCorrect = false;
    if (currentQuiz.capital.toLowerCase() === answer.toLowerCase()) {
        isCorrect = true;
        totalScore++;
        console.log(totalScore);
        
    }
    nextQuizs();
    res.render("index.ejs", {
        currentQuiz,
        wasCorrect: isCorrect,
        totalScore
    })
})

async function nextQuizs() {
    const randomQuiz = quiz[Math.floor(Math.random()* quiz.length)]
    currentQuiz = randomQuiz;
}

// listen
app.listen(port, (req, res) => {
    console.log(`Server on port ${port}`);
})