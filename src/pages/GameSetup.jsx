import { useState } from "react";
import {
  FaArrowLeft,
  FaCog,
  FaPlay,
  FaUserFriends,
  FaRobot,
} from "react-icons/fa";
import "../pages/GameSetup.css";

function GameSetup({ onBack, onStartGame }) {
  const [boardSize, setBoardSize] = useState(3);
  const [winCondition, setWinCondition] = useState(3);
  const [mode, setMode] = useState("ai");

  const handleStartGame = () => {
    onStartGame({ boardSize, winCondition, mode });
  };

  return (
    <main className="game-setup-main">
      <div className="game-setup-container">
        <div className="game-setup-header">
          <button className="game-setup-back-btn" onClick={onBack}>
            <FaArrowLeft />
          </button>
          <h1 className="game-setup-title">Game Setup</h1>
          <div></div>
        </div>

        <div className="game-setup-content">
          <h3 className="game-setup-desc">
            Configure your game before starting
          </h3>

          <div className="game-setup-panel">
            {/* Board Size */}
            <div className="setup-section">
              <label className="setup-label">Board Size</label>
              <div className="option-grid">
                {[3, 4, 5, 6, 7].map((size) => (
                  <button
                    key={size}
                    className={`option-btn ${
                      boardSize === size ? "active" : ""
                    }`}
                    onClick={() => {
                      setBoardSize(size);
                      if (winCondition > size) setWinCondition(size);
                    }}
                  >
                    <div className="option-number">{size}</div>
                    <div className="option-text">
                      {size}×{size}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Win Condition */}
            <div className="setup-section">
              <label className="setup-label">Win Condition</label>
              <div className="option-list">
                {Array.from({ length: boardSize - 2 }, (_, i) => i + 3).map(
                  (num) => (
                    <button
                      key={num}
                      className={`option-btn-row ${
                        winCondition === num ? "active" : ""
                      }`}
                      onClick={() => setWinCondition(num)}
                    >
                      {num} in a row
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Game Mode */}
            <div className="setup-section">
              <label className="setup-label">Game Mode</label>
              <div className="mode-grid">
                <button
                  className={`mode-card ai ${mode === "ai" ? "active" : ""}`}
                  onClick={() => setMode("ai")}
                >
                  <FaRobot className="mode-icon" />
                  <div className="mode-title">AI Mode</div>
                  <div className="mode-desc">Battle against the machine!</div>
                </button>

                <button
                  className={`mode-card pvp ${mode === "pvp" ? "active" : ""}`}
                  onClick={() => setMode("pvp")}
                >
                  <FaUserFriends className="mode-icon" />
                  <div className="mode-title">PvP</div>
                  <div className="mode-desc">
                    Challenge your friends locally.
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="game-setup-btn-group">
          <button className="game-setup-start-btn" onClick={handleStartGame}>
            <FaPlay className="game-setup-icon start" />
            START GAME
          </button>
        </div>
      </div>
    </main>
  );
}

export default GameSetup;
