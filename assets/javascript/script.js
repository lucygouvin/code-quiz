var buttonEl = $(".start-button")
var multipleChoiceList = $(".multiple-choice")
var timerElement = $(".countdown")

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
var timePenalty = timeTotal/questions.length;

function startQuiz() {
    console.log("button clicked");
    // start the timer
    timerCount = timeTotal;
    timerElement.text(timerCount);
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
        $(".question").text(activeQuestion[0]);

        for (var i = 1; i < activeQuestion.length - 1; i++) {
            var optionButton = $("<button>");
            optionButton.addClass("option-button")
            optionButton.text(activeQuestion[i])
            multipleChoiceList.append(optionButton)
            // console.log(answerButtons)
        }
    }else{
        score = Math.max(0,timerCount);
        console.log("score"+score)
        multipleChoiceList.empty();
    }
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

multipleChoiceList.on("click", ".option-button", validateAnswer)

buttonEl.on("click", startQuiz);