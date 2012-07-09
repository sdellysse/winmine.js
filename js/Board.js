(function (window, undefined) {

    /**
     * This is the main game object. Creates the Grid, keeps track of
     * global state, generates all necessary DOM elements, binds the
     * events to the Tiles. Keeps a log of events to allow for serialization.
     */
    var Board = function (options) {
        this.width = options.height;
        this.height = options.width;
        this.numberOfMines = options.numberOfMines;
        this.setClassic(options.classic);

        if (options.bombLocations) {
            this.bombLocations = options.bombLocations;
        } else {
            this.bombLocations = [];
            this.bombLocations.contains = function (row, column) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].row === row && this[i].column === column) {
                        return true;
                    }
                }
                return false;
            };

            for (var i = 0; i < this.numberOfMines; i++) {
                var row, column;
                do {
                    row = Math.floor(Math.random() * 10000) % this.height;
                    column = Math.floor(Math.random() * 10000) % this.width;
                } while (this.bombLocations.contains(row, column));
                this.bombLocations.push({row: row, column: column});
            }
        }

        if (options.time) {
            this.time = options.time;
        }

        this.initialize();

        if (options.log) {
            this.doActions = options.log;
        }
    };

    Board.prototype.initialize = function () {
        var self = this;
        this.grid = new Grid(this, this.height, this.width);
        this.bombLocations.forEach(function (location) {
            self.grid.getTileAt(location.row, location.column).setBomb(true);
        });
    };

    Board.prototype.extractData = function () {
        return {
            height: this.height,
            width: this.width,
            classic: this.isClassic(),
            numberOfMines: this.getNumberOfBombs(),
            bombLocations: this.bombLocations,
            time: this.getTime(),
            log: this.getLog(),
        };
    };

    Board.prototype.getNumberOfBombs = function () {
        return this.numberOfMines;
    };

    Board.prototype.isClassic = function () {
        return this.classic;
    };
    Board.prototype.setClassic = function (classic) {
        this.classic = classic;
    };

    Board.prototype.pokeAll = function () {
        this.getGrid().pokeAll();
    };
    Board.prototype.exposeBombs = function () {
        this.getGrid().exposeBombs();
    };

    Board.prototype.getGrid = function () {
        return this.grid;
    };
    Board.prototype.getHeight = function () {
        return this.getGrid().getHeight();
    };
    Board.prototype.getWidth = function () {
        return this.getGrid().getWidth();
    };

    Board.prototype.setRunning = function (running) {
        this.running = running;
    };
    Board.prototype.isRunning = function () {
        return this.running || false;
    };

    Board.prototype.displayTime = function (time) {
        var digits = this.getTime().toString().split('');
        while (digits.length < 3) {
            digits.unshift(0);
        }

        $('#timer').empty();
        digits.forEach(function (digit) {
            $("#timer").append("<img src='image/time-"+digit+".png' alt='"+digit+"' />");
        });
    };

    Board.prototype.getTime = function () {
        return this.time || 0;
    };
    Board.prototype.incrementTimer = function () {
        this.time = this.getTime() + 1;
    };

    Board.prototype.start = function () {
        this.setRunning(true);

        var self = this;
        var updateTime = function () {
            if (self.isRunning()) {
                self.displayTime(self.getTime());
                self.incrementTimer();
                window.setTimeout(updateTime, 1000);
            }
        };

        updateTime();

        this.render();
    };

    Board.prototype.bombPoked = function () {
        if (this.isRunning()) {
            this.stop();
            $("#smiley img").attr("src", "image/indicator-bad.png");
            $("#smiley img").bind("click", function (event) {
                event.preventDefault();
                window.newGame();
            });
        }
    };
    Board.prototype.won = function () {
        if (this.isRunning()) {
            $("#smiley img").attr("src", "image/indicator-won.png");
            $("#smiley img").bind("click", function (event) {
                event.preventDefault();
                window.newGame();
            });
        }

        this.stop();
    }
    Board.prototype.stop = function () {
        this.setRunning(false);
        $('#cheat-button').remove();
        this.pokeAll();
    };

    Board.prototype.getLog = function () {
        return this.log;
    }
    Board.prototype.addToLog = function (verb, data) {
        if (!this.log) {
            this.log = [];
        }
        data = data || [];
        this.log.push([verb, data]);
    };

    Board.prototype.isValid = function () {
        for (var r = 0; r < this.getHeight(); r++) {
            for (var c = 0; c < this.getWidth(); c++) {
                var tile = this.getGrid().getTileAt(r, c);
                if (!tile.hasBeenPoked() && !tile.isBomb()) {
                    return false;
                }
            }
        }

        return true;
    };

    Board.prototype.validate = function () {
        this.addToLog("validate");
        if (this.isValid()) {
            this.won();
        } else {
            this.bombPoked();
            return;
        }
    };

    Board.prototype.cheat = function () {
        this.addToLog("cheat");
        this.exposeBombs();
    };

    Board.prototype.save = function () {
        var saves = JSON.parse(localStorage.getItem("saves")) || {};
        saves[prompt("Name").toLowerCase()] = this.extractData();
        localStorage.setItem("saves", JSON.stringify(saves));
    };

    Board.prototype.poke = function (r, c) {
        this.addToLog("poke", [r, c]);
        this.getGrid().pokeTileAt(r, c);
    };

    Board.prototype.flag = function (r, c) {
        this.addToLog("flag", [r, c]);
        this.getGrid().flagTileAt(r, c);
    };

    Board.prototype.render = function () {
        var self = this;

        window.jQuery(function ($) {
            $("#play-area").empty();

            var cheatButton = $("<button id='cheat-button'>Cheat</button>");
            $(cheatButton).bind("click", function (event) {
                event.preventDefault();
                self.cheat();
            });
            $('#play-area').append(cheatButton);

            var saveButton = $("<button id='save-game'>Save Game</button>");
            $(saveButton).css("top", 5+$("#load-game").height()+10);
            $(saveButton).bind("click", function (event) {
                event.preventDefault();
                self.save();
            });
            $("#play-area").append(saveButton);

            var table = $("<table cellspacing='0' cellpadding='0'/>");
            var header = $("<tr/>");
            var headerCell = $(
                "<th colspan='"+self.getWidth()+"'>"+
                    "<span id='smiley'><img src='image/indicator-good.png' /></span>"+
                    "<span id='timer'><img src='image/time-0.png' /><img src='image/time-0.png' /><img src='image/time-0.png' /></span>"+
                "</th>"
            );
            header.append(headerCell);
            table.append(header);

            for (var r = 0; r < self.getHeight(); r++) {
                var tr = $("<tr />");
                for (var c = 0; c < self.getWidth(); c++) {
                    (function (r, c) {
                        var td = $("<td/></td>");

                        self.getGrid().getTileAt(r, c).setElement(td);

                        td.bind("click", function (event) {
                            event.preventDefault();
                            self.poke(r, c);
                        });
                        td.bind("contextmenu", function (event) {
                            event.preventDefault();
                            self.flag(r, c);
                        });

                        tr.append(td);
                    })(r, c);
                }
                table.append(tr);
            }
            $("#play-area").append(table);

            $("#smiley img").bind("click", function (event) {
                event.preventDefault();
                self.validate();
            });

            /**
             * Now that everything is all set up, execute any actions from a
             * saved game.
             */
            if (self.doActions) {
                self.doActions.forEach(function (action) {
                    self[action[0]].apply(self, action[1]);
                });
            }
        });
    };

    window["Board"] = Board;
})(window);
