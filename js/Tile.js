(function (window, undefined) {
    /**
     * A Tile is a container object that keeps track of its neighbors and
     * its own state. The Board injects an element into it, and it updates
     * that element upon state change.
     */
    var Tile = function (grid) {
        this.setGrid(grid);
        this.setBomb(false);
        this.setFlagged(false);
    };

    Tile.prototype.isBomb = function () {
        return this.bomb;
    };
    Tile.prototype.setBomb = function (bomb) {
        this.bomb = !!bomb;
    };

    Tile.prototype.disable = function () {
        $(this.getElement()).removeClass("flagged");
        $(this.getElement()).addClass("poked");
    };

    Tile.prototype.getElement = function () {
        return this.button;
    };
    Tile.prototype.setElement = function (button) {
        this.button = button;
    };

    Tile.prototype.getGrid = function () {
        return this.grid;
    };
    Tile.prototype.setGrid = function (grid) {
        this.grid = grid;
    };

    Tile.prototype.hasBeenPoked = function () {
        return this.poked || false;
    };
    Tile.prototype.setPoked = function (poked) {
        this.poked = poked;
    };

    /**
     * If "cascade poke" option is set, keep track of which neighbors
     * not to hit when doing a recursive poke. Otherwise, neighborExceptions
     * should be undefined.
     */
    Tile.prototype.poke = function (neighborExceptions) {
        this.setPoked(true);

        this.disable();
        this.expose();

        if (this.isBomb()) {
            this.getGrid().getBoard().bombPoked();
        } else {
            if (this.getNumberOfNeighborBombs() === 0 && this.getGrid().getBoard().isClassic()) {
                neighborExceptions = neighborExceptions || [];
                neighborExceptions.push(this);
                this.pokeNeighborsExcept(neighborExceptions);
            }
        }
    };
    Tile.prototype.pokeNeighborsExcept = function (exceptions) {
        if (!exceptions.contains) {
            exceptions.contains = function (item) {
                for (var i = 0; i < this.length; i++) {
                    if (item === this[i]) {
                        return true;
                    }
                }
                return false;
            };
        }

        if (this.getNorth() && !exceptions.contains(this.getNorth())) {
            this.getNorth().poke(exceptions);
        }

        if (this.getNorthWest() && !exceptions.contains(this.getNorthWest())) {
            this.getNorthWest().poke(exceptions);
        }

        if (this.getNorthEast() && !exceptions.contains(this.getNorthEast())) {
            this.getNorthEast().poke(exceptions);
        }

        if (this.getWest() && !exceptions.contains(this.getWest())) {
            this.getWest().poke(exceptions);
        }

        if (this.getEast() && !exceptions.contains(this.getEast())) {
            this.getEast().poke(exceptions);
        }

        if (this.getSouth() && !exceptions.contains(this.getSouth())) {
            this.getSouth().poke(exceptions);
        }

        if (this.getSouthWest() && !exceptions.contains(this.getSouthWest())) {
            this.getSouthWest().poke(exceptions);
        }

        if (this.getSouthEast() && !exceptions.contains(this.getSouthEast())) {
            this.getSouthEast().poke(exceptions);
        }
    };

    Tile.prototype.exposeBomb = function () {
        if (this.isBomb()) {
            $(this.getElement()).addClass("exploded");
        }
    };

    Tile.prototype.getNumberOfNeighborBombs = function () {
        var retval = 0;
        if (this.getNorthWest() && this.getNorthWest().isBomb()) {
            retval = retval + 1;
        }
        if (this.getNorth() && this.getNorth().isBomb()) {
            retval = retval + 1;
        }
        if (this.getNorthEast() && this.getNorthEast().isBomb()) {
            retval = retval + 1;
        }
        if (this.getEast() && this.getEast().isBomb()) {
            retval = retval + 1;
        }
        if (this.getWest() && this.getWest().isBomb()) {
            retval = retval + 1;
        }
        if (this.getSouthWest() && this.getSouthWest().isBomb()) {
            retval = retval + 1;
        }
        if (this.getSouth() && this.getSouth().isBomb()) {
            retval = retval + 1;
        }
        if (this.getSouthEast() && this.getSouthEast().isBomb()) {
            retval = retval + 1;
        }

        return retval;
    };

    Tile.prototype.expose = function () {
        if (this.isBomb()) {
            this.exposeBomb();
        } else {
            if (this.getGrid().getBoard().isClassic()) {
                if (this.getNumberOfNeighborBombs()) {
                    $(this.getElement()).text(this.getNumberOfNeighborBombs());
                }
            } else {
                $(this.getElement()).text(this.getNumberOfNeighborBombs());
            }
        }
    };

    Tile.prototype.flag = function () {
        this.setFlagged(true);
        $(this.getElement()).addClass('flagged');
    };
    Tile.prototype.isFlagged = function () {
        return this.flagged;
    };
    Tile.prototype.setFlagged = function (flagged) {
        this.flagged = flagged;
    };

    /**
     * Below is just the boilerplate to make sure that Tiles reference
     * eachother consistently.
     */
    Tile.prototype.getNorth = function () {
        return this.north;
    };
    Tile.prototype.setNorth = function (tile) {
        this.north = tile;
        if (tile.getSouth() !== this) {
            tile.setSouth(this);
        }
    };

    Tile.prototype.getNorthWest = function () {
        return this.northWest;
    };
    Tile.prototype.setNorthWest = function (tile) {
        this.northWest = tile;
        if (tile.getSouthWest() !== this) {
            tile.setSouthWest(this);
        }
    };

    Tile.prototype.getNorthEast = function () {
        return this.northEast;
    };
    Tile.prototype.setNorthEast = function (tile) {
        this.northEast = tile;
        if (tile.getSouthEast() !== this) {
            tile.setSouthEast(this);
        }
    };

    Tile.prototype.getSouth = function () {
        return this.south;
    };
    Tile.prototype.setSouth = function (tile) {
        this.south = tile;
        if (tile.getNorth() !== this) {
            tile.setNorth(this);
        }
    };

    Tile.prototype.getSouthWest = function () {
        return this.southWest;
    };
    Tile.prototype.setSouthWest = function (tile) {
        this.southWest = tile;
        if (tile.getNorthWest() !== this) {
            tile.setNorthWest(this);
        }
    };

    Tile.prototype.getSouthEast = function () {
        return this.southEast;
    };
    Tile.prototype.setSouthEast = function (tile) {
        this.southEast = tile;
        if (tile.getNorthEast() !== this) {
            tile.setNorthEast(this);
        }
    };

    Tile.prototype.getWest = function () {
        return this.west;
    };
    Tile.prototype.setWest = function (tile) {
        this.west = tile;
        if (tile.getEast() !== this) {
            tile.setEast(this);
        }
    };

    Tile.prototype.getEast = function () {
        return this.east;
    };
    Tile.prototype.setEast = function (tile) {
        this.east = tile;
        if (tile.getWest() !== this) {
            tile.setWest(this);
        }
    };

    window["Tile"] = Tile;
})(window);
