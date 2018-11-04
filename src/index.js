import "./index.css";
import React, {Component} from "react";
import ReactDOM from "react-dom";

class Cell extends Component {
    render() {
        const color = this.props.status;
        return (
            <button
                className={`cell ${color}`}
                onClick={this.props.onClick}>
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
            "color": "red",
            "squares": Array(7).fill([]),
            "status": null,
        };
    }

    handleClick(j) {
        let squares = this.state.squares;
        if (squares[j].length === 6) {
            this.setState({
                "status": "INVALID PLACE",
            });
        } else {
            squares[j] = squares[j].concat(this.state.color);

            this.setState({
                "squares": squares,
                "color": this.state.color === "red" ? "blue" : "red",
            });

            const len = squares[j].length - 1;

            if (squares[j][len] === squares[j][len - 1] &&
                squares[j][len] === squares[j][len - 2] &&
                squares[j][len] === squares[j][len - 3]) {
                this.setState({
                    "status": `WINNER: ${squares[j][len]}`,
                });
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
                        "status": `WINNER: ${squares[j][len]}`,
                    });
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
                        "status": `WINNER: ${squares[j][len]}`,
                    });
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
                        "status": `WINNER: ${squares[j][len]}`,
                    });
                    return;
                }
            }

        }
    }

    render() {
        let status = this.state.status;
        return (
            <div className="App">
                <Board squares={this.state.squares}
                    onClick={(j) => this.handleClick(j)} />
                <div>{status}</div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
