import {
  FaRobot,
  FaUserFriends,
  FaTrophy,
  FaTrash,
  FaPlay,
} from "react-icons/fa";

function HistoryItem({ game, index, onDelete, onReplay }) {
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
    <div className="history-item">
      <div className="history-item-header">
        <div className="history-mode">
          {game.mode === "ai" ? (
            <>
              <FaRobot /> AI Mode
            </>
          ) : (
            <>
              <FaUserFriends /> PvP Mode
            </>
          )}
        </div>
        <div className="history-item-actions">
          <button className="history-replay-btn" onClick={() => onReplay(game)}>
            <FaPlay />
          </button>
          <button
            className="history-delete-btn"
            onClick={() => onDelete(index)}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="history-item-body">
        <div className="history-info">
          <span className="info-label">Board:</span>
          <span className="info-value">
            {game.boardSize}×{game.boardSize}
          </span>
        </div>
        <div className="history-info">
          <span className="info-label">Win Condition:</span>
          <span className="info-value">{game.winCondition} in a row</span>
        </div>
        <div className="history-info">
          <span className="info-label">Date:</span>
          <span className="info-value">{formatDate(game.timestamp)}</span>
        </div>
      </div>

      <div className="history-item-result">
        {game.winner === "draw" ? (
          <div className="result-draw">
            <span className="result-icon">🤝</span>
            <span className="result-text">Draw</span>
          </div>
        ) : (
          <div className={`result-winner winner-${game.winner}`}>
            <FaTrophy className="result-icon" />
            <span className="result-text">
              {game.winner === "X"
                ? "Player X"
                : game.mode === "ai"
                ? "AI"
                : "Player O"}{" "}
              Won!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryItem;
