// Create variable for element from the HTML
var leaderboardEl = $(".score-list")
// Get the leaderboard from local storage
leaderboard = JSON.parse(localStorage.getItem("leaderboard"))
if (leaderboard === null) {
    leaderboardEl.text("No scores yet!")
} else {
    // Create scoreEntry elements for each object in the leaderboard, append to leaderboardEl
    for (var i = 0; i < leaderboard.length; i++) {
        var scoreEntry = $("<li>")
        scoreEntry.text(leaderboard[i].playerInitials + " - " + leaderboard[i].playerScore)
        leaderboardEl.append(scoreEntry)
    }
}

// If you click the reset button, clear the local storage and wipe the page
$("button[name = 'reset']").on("click", function () {
    localStorage.clear();
    leaderboardEl.empty();
})

// If you click the return button, go back to index
$("button[name = 'return']").on("click", function () {
    window.location.href = "../index.html"
})