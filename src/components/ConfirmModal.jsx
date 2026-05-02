function ConfirmModal({
  icon,
  title,
  text,
  cancelText = "Cancel",
  confirmText = "Confirm",
  onCancel,
  onConfirm,
}) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <div className="confirm-icon">{icon}</div>
        <h2 className="confirm-title">{title}</h2>
        <p className="confirm-text">{text}</p>
        <div className="confirm-buttons">
          <button className="confirm-btn cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="confirm-btn confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
