import React, { useState } from 'react';
import Board from './Board';

const WIN_CONDITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const PLAYERS = {
  X: 'X',
  O: 'O',
};

const Game = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYERS.X);
  const [winner, setWinner] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const switchPlayer = () => {
    let updatePlayer = currentPlayer === PLAYERS.X ? PLAYERS.O : PLAYERS.X
    console.log("upda", updatePlayer)
    setCurrentPlayer(updatePlayer)
    console.log("curr", currentPlayer)

    //handleSquareClick()
  }

  const handleSquareClick = (index) => {

    if (squares[index] || winner) return;

    const updatedSquares = [...squares];
    updatedSquares[index] = currentPlayer;
    setSquares(updatedSquares);

    const isWinner = checkWinner(updatedSquares);
    if (isWinner) {
      setWinner(isWinner);
      setShowPopup(true);
      return;
    }
    
    let updateCurrPlayer = currentPlayer === PLAYERS.X ? PLAYERS.O : PLAYERS.X
    //setCurrentPlayer(updateCurrPlayer)
    switchPlayer()
    console.log("crrr", currentPlayer)

    if (updateCurrPlayer === PLAYERS.O) {
      const bestMove = bestMoveAlgo(updatedSquares, PLAYERS.O);
      updatedSquares[bestMove] = PLAYERS.O;
      setSquares(updatedSquares);

      const isWinner = checkWinner(updatedSquares);
      if (isWinner) {
        setWinner(isWinner);
        setShowPopup(true);
        return;
      }
    }

    setCurrentPlayer(PLAYERS.X);
  };

  const checkWinner = (squares) => {
    for (const condition of WIN_CONDITIONS) {
      const [a, b, c] = condition;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    let openSpots = 0;
        for (let i = 0; i < 9; i++) {
            if (!squares[i]) {
                openSpots = openSpots+1;
            }
        }
        if (openSpots === 0) {
            return 'Draw'
        }

    return null;
  }

  const bestMoveAlgo = (squares, player) => {
    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            squares[i] = player
            let updatePlayer = player === PLAYERS.X ? PLAYERS.O : PLAYERS.X
            const score = minimax(squares, updatePlayer);
            squares[i] = null

            if (score > bestScore) {
                bestScore = score;
                bestMove = i
            }
        }
    }

    return bestMove
  }

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setCurrentPlayer(PLAYERS.X);
    setWinner(null);
    setShowPopup(false);
  };

  const minimax = (squares, player) => {
  
    if (checkWinner(squares) === PLAYERS.O) {
      return 1;
    } else if (checkWinner(squares) === PLAYERS.X) {
      return -1;
    } else {
        let openSpots = 0;
        for (let i = 0; i < 9; i++) {
            if (!squares[i]) {
                openSpots = openSpots+1;
            }
        }
        if (openSpots === 0) {
            return 0
        }
    }

    let bestScore;
    if (player === PLAYERS.X) {
        bestScore = -Infinity
    }else {
        bestScore = Infinity
    }

    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            squares[i] = player;
            let updatePlayer = player === PLAYERS.X ? PLAYERS.O : PLAYERS.X
            const score = minimax(squares, updatePlayer);
            squares[i] = null;

            if (player === PLAYERS.X) {
                bestScore = Math.max(bestScore, score);
            } else {
                bestScore = Math.min(bestScore, score);
            }
        }
    }

    return bestScore;
  }

  return (
    <div className="game">
      <div className="game-board">
        <h2>{`${currentPlayer}'s Turn`}</h2>
        <Board squares={squares} onClick={handleSquareClick} />
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
          {winner !== 'Draw' ? (
              <>
                <p>Winner:</p>
                <p>{winner}</p>
              </>
            ) : (
              <p>It's a Draw!</p>
            )}
            <button onClick={resetGame}>Reset Game</button>
          </div>
        </div>
      )}
    </div>
  )
}
export default Game;