// Create variables for elements in the HTML
var timerEl = $(".countdown")
var mainEl = $("main")
var bigTextEl = $(".big-text")
var addlTextEl = $(".addl-text")
var displayAreaEl = $(".display-area")

// Create start button for the landing page view, append to main
var startButtonEl = $("<button>Start</button>")
mainEl.append(startButtonEl)

// Create elements that will be used during the quiz view, don't append yet
var multipleChoiceList = $("<div>")
multipleChoiceList.addClass("multiple-choice")     
var answerEl = $("<p>")
answerEl.addClass("answer")

// Create element that will be used during the initial entry view, don't append yet
var initialInput = $("<input>")
initialInput.attr({
    maxlength: 5,
    id: "initials"
})

// Array of arrays that holds the questions, multiple choice options, and answers
// [0] = question, [1] - [length-2] = answers, [length-1] = correct answer
var questions = [
    ["Please choose answer a", "a", "b", "c", "d", "a"],
    ["Please choose answer b", "a", "b", "c", "d", "b"],
    ["Please choose answer c", "a", "b", "c", "d", "c"],
    ["Please choose answer d", "a", "b", "c", "d", "d"],
]
// Stores the correct answer for the active question
var answer;

// timeTotal declared globally for ease of adjusting
var timeTotal = 30000;
// timePenalty is the total time divided by number of questions to guarantee that getting all of them wrong will have a score of 0. Math.ceil used to ensure no fractional seconds
var timePenalty = Math.ceil(timeTotal / questions.length);
// timerCount is current remaining time
var timerCount;


function startQuiz() {
    // Remove addlText and startButton
    mainEl.css("text-align", "left")
    addlTextEl.empty();
    startButtonEl.detach();
    // Append multipleChoiceList and answerEl so we can use them
    displayAreaEl.append(multipleChoiceList, answerEl)

    // Set the timer, display that amount on the page
    timerCount = timeTotal;
    timerEl.text(timerCount);
    startTimer();

    // Get the first question
    getQuestion()
}

function startTimer() {
    timer = setInterval(function () {
        // If the player is not out of time, keep counting down every second
        if (timerCount > 0) {
            timerCount--;
            timerEl.text(timerCount);
        } else {
            // If the player is out of time, stop the timer and move on to logging your initials
            clearInterval(timer);
            timerEl.text(Math.max(0,timerCount));
            enterInitials();
        }
    }, 1000)
}

function getQuestion() {
    // If there are unanswered questions, provide a new question
    if (questions.length > 0) {
        // Clear out any multiple choice options from the previous question
        multipleChoiceList.empty();
        // Get a random question
        var randomInt = Math.floor(Math.random() * questions.length);
        var activeQuestion = questions[randomInt];
        // Remove this question from the list of questions
        questions.splice(randomInt, 1);
        // Store the answer to a global variable so it is accessible to the validateAnswer function
        answer = activeQuestion[activeQuestion.length - 1];
        // Put the question text in the h1 element
        bigTextEl.text(activeQuestion[0]);
        // For each multiple choice option, create a button and append it to the mutlipleChoiceList section
        for (var i = 1; i < activeQuestion.length - 1; i++) {
            var optionButton = $("<button>" + activeQuestion[i] + "</button>");
            optionButton.addClass("option-button")
            multipleChoiceList.append(optionButton)
        }
    }else{
        // If there are no more unanswered questions, clear the timer and move on to logging your initials
        clearInterval(timer);
        timerEl.text(Math.max(0,timerCount))
        enterInitials();
    }
}

function validateAnswer(event) {
    // If the text from the event target (the multiple choice button that was clicked) is equal to the current answer
    if (event.target.innerText === answer) {
        answerEl.text("Correct!")
    } else {
        // Decrement the remaining time by the globally set timePenalty
        // Math.floor prevents this from returning fractional seconds
        timerCount = Math.floor(timerCount - timePenalty);
        answerEl.text("Incorrect!")
    }
    // Show a new question
    getQuestion();
}

function enterInitials() {
    mainEl.removeAttr("style")
    // Dynamic text to better explain why the quiz ended
    if (!timerCount) {
        bigTextEl.text("You ran out of time!")
    } else {
        bigTextEl.text("Record Your Score!")
    }
    // Score can never be less than zero, even though a player who spams can create a negative timerCount
    addlTextEl.text("Your score is: " + Math.max(0,timerCount))

    // Clear out the displayAreaEl so we can append the elements necessary for entering initials
    displayAreaEl.empty();
    // Create the inputLabel for the initialInput field
    var inputLabel = $("<label>Enter initials: </label>")
    inputLabel.attr("for", "initials");
    // Create the button 
    var submitButton = $("<button>Submit</button>")
    submitButton.attr("name", "submit")
    // Append elements to the displayAreaEl
    displayAreaEl.append(inputLabel, initialInput, submitButton)
}


function saveScore() {
    // Initial input cannot be blank
    if (initialInput.val()) {
        // Create a highscore object
        var highscore = {
            playerInitials: initialInput.val().toUpperCase(),
            playerScore: Math.max(0,timerCount)
        }
        // See if there is an existing leaderboard object in localStorage
        var leaderboard = JSON.parse(localStorage.getItem("leaderboard"))
        // If not (leaderboard is null), set it equal to an empty array
        if (leaderboard === null) {
            leaderboard = []
        }
        // Add the highscore object to the array
        leaderboard.push(highscore);
        // Sort the array by score, so that higher scores are first
        leaderboard.sort(function (a, b) {
            if (a.playerScore > b.playerScore) {
                return -1
            } else if (a.playerScore < b.playerScore) {
                return 1;
            } return 0;
        })
        // Save updated array to localStorage. Only keep the top 10 scores.
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard.slice(0,10)));
        // Load the leaderboard page
        window.location.href = "leaderboard.html"
    } else {
        // Empty any previous error message, explain why a blank answer cannot be submitted
        $(".display-area > p").empty()
        $("<p>Initials can't be blank</p>").appendTo(displayAreaEl)
    }
}
// Use event propogation, since the submit button is not a global variable. Only run if the target's name was "submit"
mainEl.on("click", "[name = 'submit']", saveScore)
// Use event propogation, since the option buttons are not global variables, and do not exist before runtime. Only run if the target's class was .option-button
multipleChoiceList.on("click", ".option-button", validateAnswer)
// Click on the start button to start the quiz
startButtonEl.on("click", startQuiz);