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

// Array that holds question objects, multiple choice options, and answers
var questions = [
    {questionString: "Which of the following values are defined as falsy?", answerOptions: ["0", "null", "undefined", "false","''","All of the above"], answerString: "All of the above"},
    {questionString: "Which type of brackets are used for creating an array?", answerOptions: ["()", "{}", "[]", "<>",], answerString: "[]"},
    {questionString: "Which is used for selecting a class?", answerOptions: [".", "#", "$", "<>",], answerString: "."},
    {questionString: "What does CSS stand for?", answerOptions: ["Cool Style Sheets", "Cascading Spread Sheets", "Cascading Style Sheets", "Critical Style Sense"], answerString: "Cascading Style Sheets"},
    {questionString: "What are {} used for?", answerOptions: ["Declaring an object", "Declaring an array", "Grouping code blocks for things like conditional statements, for loops, or functions ", "Both 1 and 3",], answerString: "Both 1 and 3"}
]
// Stores the correct answer for the active question
var answer;

// timeTotal declared globally for ease of adjusting
var timeTotal = 60;
// timePenalty is the total time divided by number of questions to guarantee that getting all of them wrong will have a score of 0. Math.ceil used to ensure no fractional seconds
var timePenalty = Math.ceil(timeTotal / questions.length);
// timerCount is current remaining time
var timerCount;


function startQuiz() {
    // Make the main element left aligned for this view, because the variable question and answer lengths don't look good centered.
    mainEl.css("text-align", "left")
    // Remove addlText and startButton
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
        answer = activeQuestion.answerString;
        // Put the question text in the h1 element
        bigTextEl.text(activeQuestion.questionString);
        // For each multiple choice option, create a button and append it to the mutlipleChoiceList section
        for (var i = 0; i < activeQuestion.answerOptions.length; i++) {
            var optionButton = $("<button>" + activeQuestion.answerOptions[i] + "</button>");
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
    // Turn off the left text-align style attribute we turned on earlier, revert to the default centered behavior. 
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