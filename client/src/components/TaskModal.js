import React, { useState } from 'react';
import './TaskModal.css';

function TaskModal({ isOpen, onClose, onCreate }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        if (title && description) {
            const taskData = { title, description };
            const newTask = await onCreate(taskData);
            if (newTask) {
                onClose();
            }
        }
    };

    return (
        isOpen ? (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <button className="modal-close" onClick={onClose}>X</button>
                    <h3>Add New Task</h3>
                    <label>Title: <input type="text" value={title} onChange={e => setTitle(e.target.value)} /></label>
                    <label>Description: <input type="text" value={description} onChange={e => setDescription(e.target.value)} /></label>
                    <button onClick={handleSubmit}>Create</button>
                </div>
            </div>
        ) : null
    );
}

export default TaskModal;
