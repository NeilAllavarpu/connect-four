import "./index.css";
import React, {Component} from "react";
import ReactDOM from "react-dom";

class Cell extends Component {
    render() {
        console.log(this.props.status);
        let color = this.props.status;
        if (typeof this.props.status === "undefined") {
            color = "empty";
        }
        return (
            <button
                className="cell"
                onClick={this.props.onClick}>
                <div className={`cell ${color}`}></div>
            </button>
        );
    }
}

class Board extends Component {
    render() {
        let cols = [];
        for (let i = 0; i < 6; ++i) {
            let row = [];
            for (let j = 0; j < 7; ++j) {
                row.push(<Cell
                    key={i * 7 + j}
                    status={this.props.squares[j][5 - i]}
                    onClick={() => this.props.onClick(j)}
                />);
            }
            cols.push(
                <div key={i} className="row">
                    {row}
                </div>
            );
        }
        return (
            <div className="board">
                {cols}
            </div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "color": "Yellow",
            "squares": Array(7).fill([]),
            "winner": null,
        };
    }

    handleClick(j) {
        let squares = this.state.squares;
        if (squares[j].length < 6 && this.state.winner === null) {
            squares[j] = squares[j].concat(this.state.color);

            const len = squares[j].length - 1;

            if (squares[j][len] === squares[j][len - 1] &&
                squares[j][len] === squares[j][len - 2] &&
                squares[j][len] === squares[j][len - 3]) {
                this.setState({
                    "winner": this.state.color,
                });
                squares[j][len] = squares[j][len] + " win";
                squares[j][len] = squares[j][len - 1] + " win";
                squares[j][len] = squares[j][len - 2] + " win";
                squares[j][len] = squares[j][len - 3] + " win";
                return;
            }

            console.log({squares, j, len});

            for (let i = 0; i < 4; ++i) {
                if (j + i - 3 >= 0 &&
                    j + i < 7 &&
                    squares[j + i].length > len &&
                    squares[j + i - 1].length > len - 1 &&
                    squares[j + i - 2].length > len - 2 &&
                    squares[j + i - 3].length > len - 3 &&
                    squares[j + i][len] === squares[j + i - 1][len] &&
                    squares[j + i][len] === squares[j + i - 2][len] &&
                    squares[j + i][len] === squares[j + i - 3][len]) {
                    this.setState({
                        "winner": this.state.color,
                    });
                    squares[j + i][len] = squares[j][len] + " win";
                    squares[j + i - 1][len] = squares[j][len] + " win";
                    squares[j + i - 2][len] = squares[j][len] + " win";
                    squares[j + i - 3][len] = squares[j][len] + " win";
                    return;
                }
            }

            for (let i = 0; i < 4; ++i) {
                if (j + i - 3 >= 0 &&
                    j + i < 7 &&
                    len + i < 6 &&
                    len + i - 3 >= 0 &&
                    squares[j + i].length > len + i &&
                    squares[j + i - 1].length > len + i - 1 &&
                    squares[j + i - 2].length > len + i - 2 &&
                    squares[j + i - 3].length > len + i - 3 &&
                    squares[j + i][len + i] === squares[j + i - 1][len + i - 1] &&
                    squares[j + i][len + i] === squares[j + i - 2][len + i - 2] &&
                    squares[j + i][len + i] === squares[j + i - 3][len + i - 3]) {
                    this.setState({
                        "winner": this.state.color,
                    });
                    squares[j + i][len + i] = squares[j - i][len + i] + " win";
                    squares[j + i - 1][len + i - 1] = squares[j + i - 1][len + i - 1] + " win";
                    squares[j + i - 2][len + i - 2] = squares[j + i - 2][len + i - 2] + " win";
                    squares[j + i - 3][len + i - 3] = squares[j + i - 3][len + i - 3] + " win";
                    return;
                }
            }

            for (let i = 0; i < 4; ++i) {
                if (j - i >= 0 &&
                    j - i + 3 < 7 &&
                    len + i < 6 &&
                    len + i - 3 >= 0 &&
                    squares[j - i].length > len + i &&
                    squares[j - i + 1].length > len + i - 1 &&
                    squares[j - i + 2].length > len + i - 2 &&
                    squares[j - i + 3].length > len + i - 3 &&
                    squares[j - i][len + i] === squares[j - i + 1][len + i - 1] &&
                    squares[j - i][len + i] === squares[j - i + 2][len + i - 2] &&
                    squares[j - i][len + i] === squares[j - i + 3][len + i - 3]) {
                    this.setState({
                        "winner": this.state.color,
                    });
                    squares[j - i][len + i] = squares[j - i][len + i] + " win";
                    squares[j - i + 1][len + i - 1] = squares[j - i + 1][len + i - 1] + " win";
                    squares[j - i + 2][len + i - 2] = squares[j - i + 2][len + i - 2] + " win";
                    squares[j - i + 3][len + i - 3] = squares[j - i + 3][len + i - 3] + " win";
                    return;
                }
            }

            this.setState({
                "squares": squares,
                "color": this.state.color === "Yellow" ? "Red" : "Yellow",
            });
        }
    }

    render() {
        let status = this.state.winner;
        if (status !== null) {
            status = (
                <div>Winner: <span className={`${this.state.color}-text`}>{this.state.color}</span></div>
            );
        } else {
            status = (
                <div>Next player: <span className={`${this.state.color}-text`}>{this.state.color}</span></div>
            );
        }
        return (
            <div className="app">
                <div className="game">
                    <Board squares={this.state.squares}
                        onClick={(j) => this.handleClick(j)} />
                </div>
                <div className="info">{status}</div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
