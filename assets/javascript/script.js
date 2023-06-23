var buttonEl = $(".start-button")
var multipleChoiceList = $(".multiple-choice")
// var answerButtons = $("button")

// [0] = question, [1] - [length-2] = answers, [length-1] = correct answer
var question1 = ["Please choose answer c", "a", "b", "c", "d", "c"]
var answer = question1[question1.length-1]



function startQuiz(){
    console.log("button clicked");
    // start the timer
    // get the first question
    getQuestion()
}

function getQuestion(){
    // TO DO randomly select a question
    $(".question").text(question1[0])
    console.log("answer is " + answer)

    for (var i = 1; i <question1.length-1; i++){
        var optionButton =  $("<button>");
        optionButton.addClass("option-button")
        optionButton.text(question1[i])
        multipleChoiceList.append(optionButton)
        // console.log(answerButtons)
    }
    
}

function validateAnswer(event){
    // console.log(event);
    // var target = event.target;
    // console.log(event.target.innerText)
    if (event.target.innerText === answer){
    console.log("correct!")
    }else{
        console.log("incorrect!")
    }

}


// Start a timer

// Display a message if you're right or wrong


multipleChoiceList.on("click", ".option-button", validateAnswer)

buttonEl.on("click", startQuiz);
