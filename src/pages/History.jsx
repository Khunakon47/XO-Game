import { useState, useEffect } from "react";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import ConfirmModal from "../components/ConfirmModal";
import HistoryItem from "../components/HistoryItem";
import "../pages/History.css";

function History({ onBack, onReplay }) {
  const [history, setHistory] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  // โหลดประวัติจาก localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("gameHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // ลบประวัติทั้งหมด
  const clearHistory = () => {
    setShowClearModal(true);
  };

  // ยืนยันการลบประวัติทั้งหมด
  const confirmClearHistory = () => {
    localStorage.removeItem("gameHistory");
    setHistory([]);
    setShowClearModal(false);
  };

  // ลบประวัติเดียว
  const deleteHistoryItem = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  // ยืนยันการลบ
  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const newHistory = history.filter((_, i) => i !== deleteIndex);
      setHistory(newHistory);
      localStorage.setItem("gameHistory", JSON.stringify(newHistory));
      setShowDeleteModal(false);
      setDeleteIndex(null);
    }
  };

  return (
    <main className="history-main">
      <div className="history-container">
        {/* Header */}
        <div className="history-header">
          <button className="history-back-btn" onClick={onBack}>
            <FaArrowLeft />
          </button>
          <h1 className="history-title">Game History</h1>
          <button
            className="history-clear-btn"
            onClick={clearHistory}
            disabled={history.length === 0}
          >
            <FaTrash />
          </button>
        </div>

        {/* History List */}
        <div className="history-list">
          {history.length === 0 ? (
            <div className="history-empty">
              <div className="empty-icon">📊</div>
              <h2 className="empty-title">No Game History</h2>
              <p className="empty-desc">
                Start playing to see your game history here!
              </p>
            </div>
          ) : (
            history.map((game, index) => (
              <HistoryItem
                key={index}
                game={game}
                index={index}
                onDelete={deleteHistoryItem}
                onReplay={onReplay}
              />
            ))
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <ConfirmModal
            icon="🗑️"
            title="Delete Game Record?"
            text="This game record will be permanently deleted from your history."
            cancelText="Cancel"
            confirmText="Delete"
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
          />
        )}

        {/* Clear All Confirmation Modal */}
        {showClearModal && (
          <ConfirmModal
            icon="🗑️"
            title="Clear All History?"
            text="All game records will be permanently deleted. This action cannot be undone."
            cancelText="Cancel"
            confirmText="Clear All"
            onCancel={() => setShowClearModal(false)}
            onConfirm={confirmClearHistory}
          />
        )}
      </div>
    </main>
  );
}

export default History;
