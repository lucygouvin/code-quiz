var mainEl = $("main")
var buttonEl = $(".start-button")
var multipleChoiceList = $(".multiple-choice")
var timerElement = $(".countdown")
var bigTextEl = $(".big-text")
var addlTextEl = $(".addl-text")

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
var timeTotal = 1;
var timePenalty = timeTotal/questions.length;

function startQuiz() {
    // start the timer
    timerCount = timeTotal;
    timerElement.text(timerCount);
    addlTextEl.empty();
    buttonEl.detach();

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
        }
    }, 1000)
}


function getQuestion() {
    if (questions.length > 0) {
        multipleChoiceList.empty();
        var randomInt = Math.floor(Math.random()*questions.length);
        var activeQuestion = questions[randomInt];
        questions.splice(randomInt,1);
        answer = activeQuestion[activeQuestion.length-1];
        bigTextEl.text(activeQuestion[0]);

        for (var i = 1; i < activeQuestion.length - 1; i++) {
            var optionButton = $("<button>");
            optionButton.addClass("option-button")
            optionButton.text(activeQuestion[i])
            multipleChoiceList.append(optionButton)
        }
    }else{
        score = Math.max(0,timerCount);
        console.log("score "+score);
        logScore();
    }
}
function logScore(){
    bigTextEl.text("Record Your Score!")
    addlTextEl.text("Your score is: " + score)
    mainEl.empty();
    var inputLabel =$("<label>")
    inputLabel.text("Enter initials: ")
    inputLabel.attr({
        for:"initials"
    })
    mainEl.append(inputLabel)
    var initialInput = $("<input>")
    initialInput.attr({
        required: true,
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
        $(".answer").text("Correct!")
    } else {
        // prevents it from returning decimal amounts of time
        timerCount = Math.floor(timerCount-timePenalty);
        if (timerCount >= 0){
            timerElement.text(timerCount);
        }else{
            timerElement.text(0);
        }
        $(".answer").text("Incorrect!")
    }
    getQuestion();

}

function loadHighScores(){

    console.log ("highscores!")
}

mainEl.on("click", "[name = 'submit']", loadHighScores)

multipleChoiceList.on("click", ".option-button", validateAnswer)

buttonEl.on("click", startQuiz);