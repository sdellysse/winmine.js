(function (window, undefined) {
    var board;

    /**
     * (Re)-Initializes the game.
     */
    var clearGame = function () {
        if (board) {
            board.stop();
            $("#play-area").empty();
        }

        $("#new-game").hide();
    };

    window["newGame"] = function (object) {
        clearGame();
        $("#new-game").show();
    };

    /**
     * Binds all extra-Board events
     */
    jQuery(function ($) {
        $("#start").bind("click", function (event) {
            event.preventDefault();
            clearGame();

            board = new Board({
                width: parseInt($("#width").attr("value"), 10),
                height: parseInt($("#height").attr("value"), 10),
                numberOfMines: parseInt($("#bombs").attr("value"), 10),
                classic: $("#cascading-pokes").is(":checked"),
            });

            board.start();
        });
        $("#load-game").bind("click", function (event) {
            event.preventDefault();
            clearGame();

            var saves = JSON.parse(localStorage.getItem("saves")) || {};
            var names = [];
            for (var key in saves) {
                if (saves.hasOwnProperty(key)) {
                    names.push(key);
                }
            }
            var message = "Choose Saved Game:\n\n"+names.sort().join("\n");
            var chosen = prompt(message);
            if (!saves[chosen]) {
                window.newGame();
            } else {
                board = new Board(saves[chosen]);
                board.start();
            }
        });

        /**
         * Let's fire this thing up.
         */
        window.newGame();
    });
})(window);
