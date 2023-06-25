var mainEl = $("main")
var startButtonEl = $("<button>")
mainEl.append(startButtonEl)
startButtonEl.text("Start")
var multipleChoiceList = $("<div>")
mainEl.append(multipleChoiceList)
var answerEl = $("<div>")
mainEl.append(answerEl)
var timerElement = $(".countdown")
var bigTextEl = $(".big-text")
var addlTextEl = $(".addl-text")
var initialInput = $("<input>")


// [0] = question, [1] - [length-2] = answers, [length-1] = correct answer
var questions = [
    ["Please choose answer a", "a", "b", "c", "d", "a"],
    ["Please choose answer b", "a", "b", "c", "d", "b"],
    ["Please choose answer c", "a", "b", "c", "d", "c"],
    ["Please choose answer d", "a", "b", "c", "d", "d"],
]
var answer;

var timerCount;
var score;
var timeTotal = 30;
var timePenalty = Math.ceil(timeTotal/questions.length);
console.log(timePenalty)

class Highscores {
    constructor(playerInitials, playerScore) {
        this.playerInitials = playerInitials
        this.playerScore = playerScore
    }
}

var leaderboard

function startQuiz() {
    // start the timer
    timerCount = timeTotal;
    timerElement.text(timerCount);
    addlTextEl.empty();
    startButtonEl.detach();

    startTimer();
    // get the first question
    getQuestion()
}

function startTimer() {
    // Sets timer
    timer = setInterval(function () {
        // if the player is not out of time, and there are unanswered questions, keep counting down
        if (timerCount>0 && questions.length){
        timerCount--;
        timerElement.text(timerCount);
        console.log(timerCount)        
        }else{
            clearInterval(timer);
            score = Math.max(0,timerCount);
            console.log("score "+score);
            logScore();
        }
    }, 1000)
}


function getQuestion() {
    // if the player is already out of questions, do nothing. handles an edge case where the player spams thorugh all questions in less than a second, before the timer condition updates.
    if (questions.length > 0) {
        multipleChoiceList.empty();
        var randomInt = Math.floor(Math.random() * questions.length);
        var activeQuestion = questions[randomInt];
        questions.splice(randomInt, 1);
        answer = activeQuestion[activeQuestion.length - 1];
        bigTextEl.text(activeQuestion[0]);

        for (var i = 1; i < activeQuestion.length - 1; i++) {
            var optionButton = $("<button>");
            optionButton.addClass("option-button")
            optionButton.text(activeQuestion[i])
            multipleChoiceList.append(optionButton)
        }
    }
}

function logScore(){
    if (!timerCount){
        bigTextEl.text("You ran out of time!")
    }else{
        bigTextEl.text("Record Your Score!")
    }
    addlTextEl.text("Your score is: " + score)
    mainEl.empty();
    var inputLabel =$("<label>")
    inputLabel.text("Enter initials: ")
    inputLabel.attr({
        for:"initials"
    })
    mainEl.append(inputLabel)
    initialInput.attr({
        maxlength: 5,
        id: "initials"
    })
    mainEl.append(initialInput)
    var submitButton = $("<button>")
    submitButton.text("Submit")
    submitButton.attr({
        type: "submit",
        name: "submit"
    })
    mainEl.append(submitButton)

}

function validateAnswer(event) {
    if (event.target.innerText === answer) {
        answerEl.text("Correct!")
    } else {
        // prevents it from returning decimal amounts of time
        timerCount = Math.floor(timerCount-timePenalty);
        if (timerCount >= 0){
            timerElement.text(timerCount);
        }else{
            timerElement.text(0);
        }
        answerEl.text("Incorrect!")
    }
    getQuestion();

}

function loadHighScores() {
    if (initialInput.val()) {
        highscore = new Highscores(initialInput.val().toUpperCase(), score)
        console.log("highscore " + highscore)

        leaderboard = JSON.parse(localStorage.getItem("leaderboard"))
        if (leaderboard === null) {
            leaderboard = []

        }
        leaderboard.push(highscore);
        leaderboard.sort(function (a, b) {
            if (a.playerScore > b.playerScore) {
                return -1
            } else if (a.playerScore < b.playerScore) {
                return 1;
            } return 0;
        })

        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        window.location.href = "leaderboard.html"
    } else {
        return
    }
}

mainEl.on("click", "[name = 'submit']", loadHighScores)

multipleChoiceList.on("click", ".option-button", validateAnswer)

startButtonEl.on("click", startQuiz);