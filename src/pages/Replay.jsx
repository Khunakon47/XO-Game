import { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import "../pages/Replay.css";

function Replay({ game, onBack }) {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [board, setBoard] = useState(
    Array(game.boardSize * game.boardSize).fill(null)
  );

  // สร้างบอร์ดตามจำนวน moves
  useEffect(() => {
    const newBoard = Array(game.boardSize * game.boardSize).fill(null);
    for (let i = 0; i <= currentMoveIndex; i++) {
      if (game.moves[i]) {
        newBoard[game.moves[i].index] = game.moves[i].player;
      }
    }
    setBoard(newBoard);
  }, [currentMoveIndex, game]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentMoveIndex < game.moves.length - 1) {
        setCurrentMoveIndex(currentMoveIndex + 1);
      } else {
        setIsPlaying(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [isPlaying, currentMoveIndex, game.moves.length]);

  const handlePlay = () => {
    if (currentMoveIndex === game.moves.length - 1) {
      setCurrentMoveIndex(-1);
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    if (currentMoveIndex > -1) {
      setCurrentMoveIndex(currentMoveIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentMoveIndex < game.moves.length - 1) {
      setCurrentMoveIndex(currentMoveIndex + 1);
    } else if (currentMoveIndex < game.moves.length) {
      setCurrentMoveIndex(game.moves.length - 1);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="replay-main">
      <div className="replay-container">
        <div className="replay-header">
          <button className="replay-back-btn" onClick={onBack}>
            <FaArrowLeft />
          </button>
          <h1 className="replay-title">Replay Game</h1>
          <div></div>
        </div>

        <div className="replay-content">
          {/* Game Info */}
          <div className="replay-info">
            <div className="info-row">
              <span className="info-label">Mode:</span>
              <span className="info-value">
                {game.mode === "ai" ? "AI Mode" : "PvP Mode"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Board:</span>
              <span className="info-value">
                {game.boardSize}×{game.boardSize}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Win Condition:</span>
              <span className="info-value">{game.winCondition} in a row</span>
            </div>
            <div className="info-row">
              <span className="info-label">Result:</span>
              <span className={`info-value result-${game.winner}`}>
                {game.winner === "draw"
                  ? "Draw"
                  : game.winner === "X"
                  ? "Player X Won"
                  : game.mode === "ai"
                  ? "AI Won"
                  : "Player O Won"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Date:</span>
              <span className="info-value">{formatDate(game.timestamp)}</span>
            </div>
          </div>

          {/* Board */}
          <div
            className="replay-board"
            style={{
              gridTemplateColumns: `repeat(${game.boardSize}, 1fr)`,
            }}
          >
            {board.map((value, index) => (
              <div
                key={index}
                className={`replay-cell ${value ? `filled-${value}` : ""}`}
              >
                {value}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="replay-controls">
            <button
              className="control-btn"
              onClick={handlePrev}
              disabled={currentMoveIndex <= -1}
            >
              <FaStepBackward />
            </button>
            <button className="control-btn play" onClick={handlePlay}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
              className="control-btn"
              onClick={handleNext}
              disabled={
                currentMoveIndex >= game.moves.length - 1 &&
                game.moves.length > 0
              }
            >
              <FaStepForward />
            </button>
          </div>

          {/* Progress */}
          <div className="replay-progress">
            <span className="progress-text">
              Move: {currentMoveIndex + 1} / {game.moves.length}
            </span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    game.moves.length === 0
                      ? 0
                      : ((currentMoveIndex + 1) / game.moves.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Moves List */}
          <div className="replay-moves">
            <h3 className="moves-title">Moves</h3>
            <div className="moves-list">
              {game.moves.map((move, idx) => (
                <button
                  key={idx}
                  className={`move-item ${
                    currentMoveIndex === idx ? "active" : ""
                  }`}
                  onClick={() => setCurrentMoveIndex(idx)}
                >
                  {idx + 1}. {move.player}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Replay;
