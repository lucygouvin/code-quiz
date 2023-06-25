var scoreDisplayEl = $(".score-display")
var leaderboardList = $(".score-list")

leaderboard = JSON.parse(localStorage.getItem("leaderboard"))

for (var i = 0; i < leaderboard.length; i++) {
    var scoreEntry = $("<li>")
    scoreEntry.text(leaderboard[i].playerInitials + " - " + leaderboard[i].playerScore)
    leaderboardList.append(scoreEntry)
}

var resetButton = $("<button>")
resetButton.text("Clear Highscores")
resetButton.attr({
    name: "reset"
})

var indexButton = $("<button>")
indexButton.text("Go Back")
indexButton.attr({
    name:"reset"
})

scoreDisplayEl.append(resetButton)
scoreDisplayEl.append(indexButton)

resetButton.on("click", function(){
    localStorage.clear();
    leaderboardList.empty();
})

indexButton.on("click", function(){
    window.location.href = "index.html"
})