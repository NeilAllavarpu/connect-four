import "./index.css";
import React, {Component} from "react";
import ReactDOM from "react-dom";

/**
 * Mark a board's winning cells
 * @param {Array} board A 2-D array describing the board
 * @param {Number} x1 X-coordinate of the first winning cell
 * @param {Number} y1 Y-coordiante of the first winning cell
 * @param {Number} x2 X-coordinate of the second winning cell
 * @param {Number} y2 Y-coordiante of the second winning cell
 * @param {Number} x3 X-coordinate of the third winning cell
 * @param {Number} y3 Y-coordiante of the third winning cell
 * @param {Number} x4 X-coordinate of the fourth winning cell
 * @param {Number} y4 Y-coordiante of the fourth winning cell
 * @returns {Array} A 2-D array including the marked board
 */
function highlightWinners(board, x1, y1, x2, y2, x3, y3, x4, y4) {
    // update the first cell to have a win class
    board[x1][y1] = `${board[x1][y1]} win`;
    // update the second cell to have a win class
    board[x2][y2] = `${board[x2][y2]} win`;
    // update the third cell to have a win class
    board[x3][y3] = `${board[x3][y3]} win`;
    // update the fourth cell to have a win class
    board[x4][y4] = `${board[x4][y4]} win`;
    // return the updated board
    return board;
}

/**
 * Renders a single cell on the board
 * @param {*} props Contains the current cell state, and onClick, onMouseOver, onMouseOut handlers
 * @returns {JSX} A JSX object for each cell in the board
 */
function Cell(props) {
    return (
        // make this a cell, give it the passed onClick, onMouseOut, onMouseOver handlers
        <button
            className="cell"
            onClick={props.onClick}
            onMouseOut={props.onMouseOut}
            onMouseOver={props.onMouseOver}
        >
            {/* give the circle inside the cell the classes associated with it in the game board */}
            <div className={`cell ${props.classes}`}></div>
        </button>
    );
}

/**
 * Check a series of cells for a potential match
 * @param {Array} board A 2-D array describing the board
 * @param {Number} x1 X-coordinate of the first cell to check
 * @param {Number} y1 Y-coordiante of the first cell to check
 * @param {Number} x2 X-coordinate of the second cell to check
 * @param {Number} y2 Y-coordiante of the second cell to check
 * @param {Number} x3 X-coordinate of the third cell to check
 * @param {Number} y3 Y-coordiante of the third cell to check
 * @param {Number} x4 X-coordinate of the fourth cell to check
 * @param {Number} y4 Y-coordiante of the fourth cell to check
 * @returns {Object} An object with a squares attribute with potentially marked squares (if the squares matched), and a winner attribute indicating if the squares matched
 */
function checkWinner(board, x1, y1, x2, y2, x3, y3, x4, y4) {
    // ensure that the first cell is defined
    let winner = board[x1].length > y1 &&
        // ensure that the second cell is defined
        board[x2].length > y2 &&
        // ensure that the third cell is defined
        board[x3].length > y3 &&
        // ensure that the fourth cell is defined
        board[x4].length > y4 &&
        // if the first cell matches the second cell
        board[x1][y1] === board[x2][y2] &&
        // if the first cell matches the third cell
        board[x1][y1] === board[x3][y3] &&
        // if the first cell matches the fourth cell
        board[x1][y1] === board[x4][y4];
    if (winner) {
        // if we had a match, mark up the squares
        board = highlightWinners(board, x1, y1, x2, y2, x3, y3, x4, y4);
    }
    // return the (potentially marked) squares and if we had a winner
    return {board, winner};
}

class App extends Component {
    constructor(props) {
        super(props);
        // set the default conditions of the game
        this.state = {
            // yellow gets to go first
            "color": "Yellow",
            // board is initially empty 2-D array
            "board": Array(7).fill([]),
            // no winner yet
            "winner": null,
        };
    }

    /**
     * Handling for clicking on a cell
     * @param {Number} x X-coordinate of the selected cell
     */
    handleClick(x) {
        // get the current board, but don't modify it
        let board = [...this.state.board];

        // if we have the cell in a hover state
        if (board[x][board[x].length - 1] === `possible${this.state.color}`) {
            // remove the hover state cell
            board[x].splice(board[x].length - 1, board[x].length);
        }

        // only if the current column isn't empty and we don't have a winner
        if (board[x].length < 6 && this.state.winner === null) {
            // add a cell of the current color to the board
            board[x] = board[x].concat(this.state.color);
            // y-coordinate of the selected cell would be the last element
            const y = board[x].length - 1;
            // variable to store the various results of the checkings
            let results = {
                // initially, board should be unchanged
                "board": board,
                // initially, we don't have a winner
                "winner": false,
            };
            // make sure we can go down 3 cells from current cell (vertical check)
            if (y >= 3) {
                /**
                 * Visualization of the check
                 * x = current cell
                 * * = other nodes we are checking
                 * |x| | | |
                 * |*| | | |
                 * |*| | | |
                 * |*| | | |
                 */
                // see if we have a winner vertically
                results = checkWinner(board,
                    // the selected cell
                    x, y,
                    // one below the selected cell
                    x, y - 1,
                    // two below the selected cell
                    x, y - 2,
                    // three below the selected cell
                    x, y - 3);
            }
            // if we haven't already found a winner
            if (results["winner"] === false) {
                // repeat 4 times, so that cell can be in each of the 4 possible positions for diagonal/horizontal matches
                // note that the newly added cell will always be at the top of its column so it can only be in one position for a vertical match
                for (let offset = 0; offset < 4; ++offset) {
                    // for the rest of the loop the "current cell" will be the offset cell
                    // i.e. (x + offset, y + offset)
                    // unless its the third case, where it would be (x + offset, y - offset)

                    // make sure that we can go at least 3 cells left, and we are not already off the right of the board (horizontal, diagonal checks)
                    // also see if we haven't already found a winner
                    if (x + offset >= 3 && x + offset < 7 && results["winner"] === false) {
                        /**
                             * Visualization of the check
                             * x = current cell
                             * * = other nodes we are checking
                             * | | | | |
                             * | | | | |
                             * | | | | |
                             * |*|*|*|x|
                             */
                        // see if we have a winner horizontally
                        results = checkWinner(board,
                            // current cell
                            x + offset, y,
                            // 1 to the left of current cell
                            x + offset - 1, y,
                            // 2 to the left of current cell
                            x + offset - 2, y,
                            // 3 to the left of current cell
                            x + offset - 3, y);
                        // see if we haven't already found a winner
                        // if so, make sure that current cell isn't above the board and we can go 3 below current cell (diagonal up + right check)
                        if (results["winner"] === false && y + offset < 6 && y + offset - 3 >= 0) {
                            /**
                             * Visualization of the check
                             * x = current cell
                             * * = other nodes we are checking
                             * | | | |x|
                             * | | |*| |
                             * | |*| | |
                             * |*| | | |
                             */
                            // see if we have a winner diagonally up + right
                            results = checkWinner(board,
                                // 3 left, 3 down from current cell
                                x + offset - 3, y + offset - 3,
                                // 2 left, 2 down from current cell
                                x + offset - 2, y + offset - 2,
                                // 1 left, 1 down from current cell
                                x + offset - 1, y + offset - 1,
                                // current cell
                                x + offset, y + offset);
                        }
                        // see if we haven't already found a winner
                        // here, current cell is (x + offset, y - offset)
                        // make sure that current cell isn't below the board and we can go 3 above current cell (diagonal up + right check)
                        if (results["winner"] === false && y - offset + 3 < 6 && y - offset >= 0) {
                            /**
                             * Visualization of the check
                             * x = current cell
                             * * = other nodes we are checking
                             * |*| | | |
                             * | |*| | |
                             * | | |*| |
                             * | | | |x|
                             */
                            // see if we have a winner diagonally down + right
                            results = checkWinner(board,
                                // 3 left, 3 up from current cell
                                x + offset - 3, y - offset + 3,
                                // 2 left, 2 up from current cell
                                x + offset - 2, y - offset + 2,
                                // 1 left, 1 up from current cell
                                x + offset - 1, y - offset + 1,
                                // current cell
                                x + offset, y - offset);
                        }
                    }
                }
            }

            // if we found a winner
            if (results["winner"] === true) {
                // winner! update the game to show this
                this.setState({
                    // update the board
                    "board": results["board"],
                    // set the winner to the current color
                    "winner": this.state.color,
                });
            } else {
                // no winner, update the game status so
                this.setState({
                    // update the board
                    "board": results["board"],
                    // switch between red and yellow
                    "color": this.state.color === "Yellow" ? "Red" : "Yellow",
                });
            }
        }
    }

    /**
     * Handling for entering the mouse into a column
     * @param {Number} x X-coordinate of the column
     */
    handleEnter(x) {
        // make sure we don't show possibilities if game is over!
        if (this.state.winner === null) {
            // get the board, but make sure we don't modify it
            let board = [...this.state.board];
            // add a darker version of the current player's color to indicate a possible move
            board[x] = board[x].concat(`possible${this.state.color}`);
            this.setState({
                // update the board with the dimmer circle
                "board": board,
            });
        }
    }

    /**
     * Handling for exiting the mouse from a column
     * @param {Number} x X-coordinate of the column
     */
    handleExit(x) {
        // get the board, but don't modify it
        let board = [...this.state.board];
        // if the column that the mouse left has a hover, darker circle at top of the column
        if (board[x][board[x].length - 1] === `possible${this.state.color}`) {
            // remove that hover, darker circle from the end of the column
            board[x].splice(board[x].length - 1, board[x].length);
            this.setState({
                // update the board with the removed item
                "board": board,
            });
        }
    }

    /**
     * Main rendring of the whole screen
     * @returns {JSX} A JSX element for the whole animation
     */
    render() {
        // status that will be shown to the right of the board,
        let status;
        // if we have a winner
        if (this.state.winner !== null) {
            // status message is "Winner: (winnerColor)", where winnerColor is colored in its color
            status = (
                <div><span className="win-desc">Winner: </span><span className={`${this.state.color}-text win-team`}>{this.state.color}</span></div>
            );
        } else {
            // no winner yet
            // status message is "Next player: (nextPlayer)", where nextPlayer is colored in its color
            status = (
                <div>Next player: <span className={`${this.state.color}-text`}>{this.state.color}</span></div>
            );
        }

        // where our array of rows of cells will be stored (i.e. the board)
        let board = [];
        // for each of the rows
        for (let i = 0; i < 6; ++i) {
            // array to store the current row
            let row = [];
            // for each column
            for (let j = 0; j < 7; ++j) {
                // add a cell
                // set its classes based on the current game's status
                // set its click handler to facilitate the adding of chips and win checking, and pass it by column
                // set its mouseOver and mouseOut handlers by the columns to handle hovering and the darker circle showing possibility
                row.push(<Cell
                    key={i * 7 + j}
                    classes={this.state.board[j][5 - i]}
                    onClick={() => this.handleClick(j)}
                    onMouseOver={() => this.handleEnter(j)}
                    onMouseOut={() => this.handleExit(j)}
                />);
            }
            // add a row of our formed row to the board
            board.push(
                <div key={i} className="row">
                    {row}
                </div>
            );
        }

        return (
            <div className="app">
                <div className="board">{board}</div>{/* display the formed board */}
                <div className="info">{status}</div>{/* status display to the right of the board */}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
