function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div
                className="modal-card confirm-dialog"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{title}</h2>
                <p>{message}</p>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="cancel-edit-btn"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="danger-button"
                        onClick={onConfirm}
                    >
                        {confirmLabel || "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;