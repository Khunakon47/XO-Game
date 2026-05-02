import { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaRedo,
  FaTrophy,
  FaRobot,
  FaUsers,
  FaHome,
} from "react-icons/fa";
import ConfirmModal from "../components/ConfirmModal";
import "../pages/GamePlay.css";

function GamePlay({ boardSize, winCondition, mode, onBack, onHome }) {
  const [board, setBoard] = useState(Array(boardSize * boardSize).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [showBackModal, setShowBackModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [moves, setMoves] = useState([]);

  const saveGameHistory = (winner) => {
    const gameData = {
      boardSize,
      winCondition,
      mode,
      winner,
      moves,
      timestamp: Date.now(),
    };
    const savedHistory = localStorage.getItem("gameHistory");
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    history.unshift(gameData);

    if (history.length > 50) {
      history.pop();
    }

    localStorage.setItem("gameHistory", JSON.stringify(history));
  };

  const saveGameHistoryWithMoves = (winner, movesData) => {
    const gameData = {
      boardSize,
      winCondition,
      mode,
      winner,
      moves: movesData,
      timestamp: Date.now(),
    };
    const savedHistory = localStorage.getItem("gameHistory");
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    history.unshift(gameData);

    if (history.length > 50) {
      history.pop();
    }

    localStorage.setItem("gameHistory", JSON.stringify(history));
  };

  // ตรวจสอบผู้ชนะ
  const checkWinner = (squares) => {
    const size = boardSize;
    const winLength = winCondition;

    // ตรวจสอบแนวนอน
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - winLength; col++) {
        const line = [];
        for (let i = 0; i < winLength; i++) {
          line.push(row * size + col + i);
        }
        const first = squares[line[0]];
        if (first && line.every((idx) => squares[idx] === first)) {
          return { winner: first, line };
        }
      }
    }

    // ตรวจสอบแนวตั้ง
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - winLength; row++) {
        const line = [];
        for (let i = 0; i < winLength; i++) {
          line.push((row + i) * size + col);
        }
        const first = squares[line[0]];
        if (first && line.every((idx) => squares[idx] === first)) {
          return { winner: first, line };
        }
      }
    }

    // ตรวจสอบแนวทะแยงมุม (บนซ้าย-ล่างขวา)
    for (let row = 0; row <= size - winLength; row++) {
      for (let col = 0; col <= size - winLength; col++) {
        const line = [];
        for (let i = 0; i < winLength; i++) {
          line.push((row + i) * size + col + i);
        }
        const first = squares[line[0]];
        if (first && line.every((idx) => squares[idx] === first)) {
          return { winner: first, line };
        }
      }
    }

    // ตรวจสอบแนวทะแยงมุม (บนขวา-ล่างซ้าย)
    for (let row = 0; row <= size - winLength; row++) {
      for (let col = winLength - 1; col < size; col++) {
        const line = [];
        for (let i = 0; i < winLength; i++) {
          line.push((row + i) * size + col - i);
        }
        const first = squares[line[0]];
        if (first && line.every((idx) => squares[idx] === first)) {
          return { winner: first, line };
        }
      }
    }

    return null;
  };

  // AI เดิน (Minimax Algorithm แบบจำกัดความลึก)
  const makeAIMove = (squares) => {
    const emptySquares = squares
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    if (emptySquares.length === 0) return null;

    // สำหรับบอร์ดใหญ่ ใช้ heuristic แทน minimax
    if (boardSize > 4 || emptySquares.length > 20) {
      // ตรวจสอบว่าสามารถชนะในตาถัดไปได้หรือไม่
      for (let i of emptySquares) {
        const testBoard = [...squares];
        testBoard[i] = "O";
        const result = checkWinner(testBoard);
        if (result && result.winner === "O") {
          return i;
        }
      }

      // ตรวจสอบว่าต้องป้องกันผู้เล่นชนะหรือไม่
      for (let i of emptySquares) {
        const testBoard = [...squares];
        testBoard[i] = "X";
        const result = checkWinner(testBoard);
        if (result && result.winner === "X") {
          return i;
        }
      }

      // เลือกช่องที่อยู่ใกล้ช่องที่มีตัวเองมากที่สุด
      let bestMove = emptySquares[0];
      let bestScore = -Infinity;

      for (let i of emptySquares) {
        let score = 0;
        const row = Math.floor(i / boardSize);
        const col = i % boardSize;

        // ให้คะแนนตำแหน่งใกล้กลางบอร์ด
        const centerRow = boardSize / 2;
        const centerCol = boardSize / 2;
        const distanceToCenter =
          Math.abs(row - centerRow) + Math.abs(col - centerCol);
        score -= distanceToCenter;

        // ให้คะแนนตำแหน่งที่อยู่ใกล้ตัว O อื่นๆ
        for (let j = 0; j < squares.length; j++) {
          if (squares[j] === "O") {
            const jRow = Math.floor(j / boardSize);
            const jCol = j % boardSize;
            const distance = Math.abs(row - jRow) + Math.abs(col - jCol);
            if (distance <= 2) score += 3 - distance;
          }
        }

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }

      return bestMove;
    }

    // สำหรับบอร์ดเล็ก ใช้ minimax
    const minimax = (squares, depth, isMaximizing, alpha, beta) => {
      const result = checkWinner(squares);
      if (result) return result.winner === "O" ? 10 - depth : depth - 10;
      if (squares.every((s) => s !== null)) return 0;
      if (depth > 6) return 0;

      const empty = squares
        .map((val, idx) => (val === null ? idx : null))
        .filter((val) => val !== null);

      if (isMaximizing) {
        let maxScore = -Infinity;
        for (let i of empty) {
          const newSquares = [...squares];
          newSquares[i] = "O";
          const score = minimax(newSquares, depth + 1, false, alpha, beta);
          maxScore = Math.max(maxScore, score);
          alpha = Math.max(alpha, score);
          if (beta <= alpha) break;
        }
        return maxScore;
      } else {
        let minScore = Infinity;
        for (let i of empty) {
          const newSquares = [...squares];
          newSquares[i] = "X";
          const score = minimax(newSquares, depth + 1, true, alpha, beta);
          minScore = Math.min(minScore, score);
          beta = Math.min(beta, score);
          if (beta <= alpha) break;
        }
        return minScore;
      }
    };

    let bestMove = emptySquares[0];
    let bestScore = -Infinity;

    for (let i of emptySquares) {
      const newSquares = [...squares];
      newSquares[i] = "O";
      const score = minimax(newSquares, 0, false, -Infinity, Infinity);
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }

    return bestMove;
  };

  // อัพเดทบอร์ดและตรวจสอบผล
  const updateBoard = (index, player) => {
    const newBoard = [...board];
    newBoard[index] = player;
    const newMoves = [...moves, { index, player }];

    setBoard(newBoard);
    setMoves(newMoves);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      // บันทึก history พร้อม moves ใหม่
      saveGameHistoryWithMoves(result.winner, newMoves);
    } else if (newBoard.every((square) => square !== null)) {
      setWinner("draw");
      saveGameHistoryWithMoves("draw", newMoves);
    } else {
      setIsXNext(!isXNext);
    }
  };

  // จัดการคลิกช่อง
  const handleClick = (index) => {
    if (board[index] || winner) return;
    if (mode === "ai" && !isXNext) return;

    updateBoard(index, isXNext ? "X" : "O");
  };

  // AI เดินอัตโนมัติ
  useEffect(() => {
    if (mode === "ai" && !isXNext && !winner) {
      const timer = setTimeout(() => {
        const aiMove = makeAIMove(board);
        if (aiMove !== null && aiMove !== undefined) {
          updateBoard(aiMove, "O");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, winner, board, mode]);

  // เริ่มเกมใหม่
  const resetGame = () => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
    setMoves([]);
    setShowResetModal(false);
  };

  // จัดการปุ่ม Back
  const handleBackClick = () => {
    if (winner) {
      onBack();
    } else {
      setShowBackModal(true);
    }
  };

  // จัดการปุ่ม Reset
  const handleResetClick = () => {
    if (winner) {
      resetGame();
    } else {
      setShowResetModal(true);
    }
  };

  return (
    <main className="gameplay-main">
      <div className="gameplay-container">
        {/* Header */}
        <div className="gameplay-header">
          <button className="gameplay-back-btn" onClick={handleBackClick}>
            <FaArrowLeft />
          </button>
          <h1 className="gameplay-title">
            {mode === "ai" ? (
              <>
                <FaRobot style={{ marginRight: "8px" }} /> AI Mode
              </>
            ) : (
              <>
                <FaUsers style={{ marginRight: "8px" }} /> PvP Mode
              </>
            )}
          </h1>
          <button className="gameplay-reset-btn" onClick={handleResetClick}>
            <FaRedo />
          </button>
        </div>

        {/* Game Status */}
        <div className="game-status">
          {winner ? (
            winner === "draw" ? (
              <span className="status-draw">🤝 It's a Draw!</span>
            ) : (
              <span className={`status-winner winner-${winner}`}>
                <FaTrophy />{" "}
                {winner === "X"
                  ? "Player X"
                  : mode === "ai"
                  ? "AI"
                  : "Player O"}{" "}
                Wins!
              </span>
            )
          ) : (
            <span className={`status-turn turn-${isXNext ? "x" : "o"}`}>
              {mode === "ai" && !isXNext
                ? "🤖 AI is thinking..."
                : `Turn: ${isXNext ? "X" : "O"}`}
            </span>
          )}
        </div>

        {/* Game Board */}
        <div
          className="game-board"
          style={{
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          }}
        >
          {board.map((value, index) => (
            <button
              key={index}
              className={`game-cell ${value ? `filled-${value}` : ""} ${
                winningLine.includes(index) ? "winning-cell" : ""
              }`}
              onClick={() => handleClick(index)}
              disabled={!!winner || (mode === "ai" && !isXNext)}
            >
              {value}
            </button>
          ))}
        </div>

        {/* Back Confirmation Modal */}
        {showBackModal && (
          <ConfirmModal
            icon="⚠️"
            title="Leave Game?"
            text="Your current game progress will be lost. Are you sure you want to go back?"
            cancelText="Cancel"
            confirmText="Leave"
            onCancel={() => setShowBackModal(false)}
            onConfirm={() => {
              setShowBackModal(false);
              onBack();
            }}
          />
        )}

        {/* Reset Confirmation Modal */}
        {showResetModal && (
          <ConfirmModal
            icon="🔄"
            title="Reset Game?"
            text="This will start a new game and your current progress will be lost."
            cancelText="Cancel"
            confirmText="Reset"
            onCancel={() => setShowResetModal(false)}
            onConfirm={resetGame}
          />
        )}

        {/* Winner Modal */}
        {winner && (
          <div className="winner-overlay">
            <div className="winner-modal">
              {winner === "draw" ? (
                <>
                  <div className="modal-icon">🤝</div>
                  <h2 className="modal-title">It's a Draw!</h2>
                  <p className="modal-subtitle">Well played both sides!</p>
                  <p className="modal-info">
                    Board: {boardSize}×{boardSize} | Win Condition:{" "}
                    {winCondition} in a row
                  </p>
                </>
              ) : (
                <>
                  <div className="modal-icon">🏆</div>
                  <h2 className="modal-title">
                    {winner === "X"
                      ? "Player X"
                      : mode === "ai"
                      ? "AI"
                      : "Player O"}{" "}
                    Wins!
                  </h2>
                  <p className="modal-subtitle">
                    {winner === "X" && mode === "ai"
                      ? "Congratulations! You beat the AI!"
                      : winner === "O" && mode === "ai"
                      ? "The AI wins this time. Try again!"
                      : "Congratulations!"}
                  </p>
                  <p className="modal-info">
                    Board: {boardSize}×{boardSize} | Win Condition:{" "}
                    {winCondition} in a row
                  </p>
                </>
              )}
              <div className="modal-buttons">
                <button className="modal-btn secondary" onClick={onHome}>
                  <FaHome style={{ marginRight: "8px" }} />
                  Home
                </button>
                <button className="modal-btn primary" onClick={resetGame}>
                  <FaRedo style={{ marginRight: "8px" }} />
                  Play Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default GamePlay;
