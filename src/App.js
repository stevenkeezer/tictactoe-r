import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MainNavBar from "./components/MainNavBar";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

const Square = props => {
  console.log(props.value);
  return (
    <button
      className="square"
      onMouseOver={() => console.log("hi")}
      onClick={props.onClick}
    >
      {props.value}
      {!props.value ? (
        <div id="hoverXO">{props.status.split(" ")[2]}</div>
      ) : (
        <div></div>
      )}
    </button>
  );
};

const Board = props => {
  const renderSquare = i => {
    return (
      <Square
        status={props.status}
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  };

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

const Game = props => {
  const initialHistory = [{ squares: Array(9).fill(null) }];
  const [history, setHistory] = useState(initialHistory);
  const [xIsNext, setXIsNext] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [topScores, setTopScores] = useState([]);
  const [isNotGameOver, setIsNotGameOver] = useState(true);

  const handleClick = i => {
    const slicedHistory = history.slice(0, stepNumber + 1);
    const finalStepInSlicedHistory = slicedHistory[slicedHistory.length - 1];
    const newSquares = [...finalStepInSlicedHistory.squares];

    const winnerDeclared = Boolean(calculateWinner(newSquares));
    const squareAlreadyFilled = Boolean(newSquares[i]);
    if (winnerDeclared || squareAlreadyFilled) return;

    newSquares[i] = xIsNext ? "X" : "O";
    const newStep = { squares: newSquares };
    const newHistory = [...slicedHistory, newStep];

    setHistory(newHistory);
    setXIsNext(!xIsNext);
    setStepNumber(slicedHistory.length);
  };

  const moves = history.map((step, move) => {
    const description = Boolean(move)
      ? `Go to move #${move}`
      : `Go to game start`;
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const jumpTo = step => {
    setStepNumber(step);
    const isEvenStepNumber = step % 2 === 0;
    setXIsNext(isEvenStepNumber);
  };

  const facebookResponse = resp => {
    if (resp.status === "unknown") return;
    setCurrentUser({
      name: resp.name,
      email: resp.email,
      imgUrl: resp.picture.data.url
    });
  };

  const googleResponse = resp => {
    resp = resp.profileObj;
    setCurrentUser({
      name: resp.name,
      email: resp.email
    });
  };

  const postScore = async () => {
    let data = new URLSearchParams();
    data.append("player", "Ann Chovy");
    data.append("score", -16657734234234234513432234335537232334168);
    const url = "https://ftw-highscores.herokuapp.com/tictactoe-dev";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data.toString(),
      json: true
    });

    getDataAPI();
  };

  const getDataAPI = async () => {
    const response = await fetch(
      "https://ftw-highscores.herokuapp.com/tictactoe-dev"
    );
    const data = await response.json();
    setTopScores(data.items);
  };

  useEffect(() => {
    getDataAPI();
  }, []);

  const currentStep = history[stepNumber];
  const winner = calculateWinner(currentStep.squares);

  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? "X" : "O"}`;

  if (winner && isNotGameOver) {
    setIsNotGameOver(false);
    postScore();
  }

  return (
    <div className="game">
      <MainNavBar>
        {!currentUser && (
          <FacebookLogin
            // autoLoad={true}
            appId={process.env.REACT_APP_FB_ID}
            fields="name,email,picture"
            callback={resp => facebookResponse(resp)}
          />
        )}
        {!currentUser && (
          <GoogleLogin
            clientId="277785108580-9nje42h9q911mg2n0h5i6gqpr6cudjka.apps.googleusercontent.com"
            buttonText="LOGIN WITH GOOGLE"
            onSuccess={resp => googleResponse(resp)}
            // onFailure={responseGoogle}
          />
        )}
        <div className="row">
          {currentUser && <div className="p-2">{currentUser.name}</div>}
          {currentUser && (
            <img
              alt="blah"
              className="rounded-circle"
              src={currentUser.imgUrl}
            ></img>
          )}
        </div>
      </MainNavBar>

      <div className="game-board">
        <Board
          status={status}
          squares={currentStep.squares}
          onClick={i => handleClick(i)}
        />
        <div className="col-md-6">
          <div id="status">{status}</div>

          <ol>{moves}</ol>
        </div>
      </div>
      <div className="game-info">
        <br></br>
        <h3>Leaderboard</h3>
        {topScores.map(user => {
          return (
            <li id="scores">
              {user.player}
              {user.score}
            </li>
          );
        })}{" "}
      </div>
    </div>
  );
};

export default Game;

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  // If none of the winning line combinations is contained in
  // input squares array, return null...
  return null;
}
