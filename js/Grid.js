(function (window, undefined) {
    /**
     * A grid is just a container of Tiles and event delegator.
     */
    Grid = (function () {
        var Grid = function (board, height, width) {
            this.setBoard(board);
            this.setHeight(height);
            this.setWidth(width);

            this.rows = new Array(this.getHeight());
            for (var r = 0; r < this.getHeight(); r++) {
                for (var c = 0; c < width; c++) {
                    this.setTileAt(r, c, new Tile(this));
                }
            }
        };
        Grid.prototype.getBoard = function () {
            return this.board;
        };
        Grid.prototype.setBoard = function (board) {
            this.board = board;
        };

        Grid.prototype.getHeight = function () {
            return this.height;
        };
        Grid.prototype.setHeight = function (height) {
            this.height = height;
        };

        Grid.prototype.getWidth = function () {
            return this.width;
        };
        Grid.prototype.setWidth = function (width) {
            this.width = width;
        };

        Grid.prototype.pokeTileAt = function (row, column) {
            var tile = this.getTileAt(row, column);
            if (tile) {
                tile.poke();
            }
        };

        Grid.prototype.flagTileAt = function (row, column) {
            var tile = this.getTileAt(row, column);
            if (tile) {
                tile.flag();
            }
        };

        Grid.prototype.getTileAt = function (row, column) {
            if (this.rows[row] && this.rows[row][column]) {
                return this.rows[row][column];
            }
        };

        Grid.prototype.setTileAt = function (r, c, tile) {
            this.rows[r] = this.rows[r] || new Array(this.getWidth());

            if (this.getTileAt(r - 1, c - 1)) {
                tile.setNorthWest(this.getTileAt(r - 1, c - 1));
            }
            if (this.getTileAt(r - 1, c)) {
                tile.setNorth(this.getTileAt(r - 1, c));
            }
            if (this.getTileAt(r - 1, c + 1)) {
                tile.setNorthEast(this.getTileAt(r - 1, c + 1));
            }
            if (this.getTileAt(r, c - 1)) {
                tile.setWest(this.getTileAt(r, c - 1));
            }
            if (this.getTileAt(r, c+1)) {
                tile.setEast(this.getTileAt(r, c+1));
            }
            if (this.getTileAt(r+1, c-1)) {
                tile.setSouthWest(this.getTileAt(r+1, c-1));
            }
            if (this.getTileAt(r+1, c)) {
                tile.setSouth(this.getTileAt(r+1, c));
            }
            if (this.getTileAt(r+1, c+1)) {
                tile.setSouthEast(this.getTileAt(r+1, c+1));
            }
            this.rows[r][c] = tile;
        };

        Grid.prototype.exposeBombs = function () {
            for (var r = 0; r < this.getHeight(); r++) {
                for (var c = 0; c < this.getWidth(); c++) {
                    this.getTileAt(r, c).exposeBomb();
                }
            }
        };

        Grid.prototype.pokeAll = function () {
            for (var r = 0; r < this.getHeight(); r++) {
                for (var c = 0; c < this.getWidth(); c++) {
                    this.getTileAt(r, c).poke();
                }
            }
        };

        return Grid;
    })();

    window["Grid"] = Grid;
})(window);
