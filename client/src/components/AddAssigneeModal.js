import React, { useState, useEffect } from 'react';
import { fetchProjectById } from '../services/apiService.js';

function AddAssigneeModal({ isOpen, onClose, onAdd, projectId }) {
    const [members, setMembers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(""); // Initialize to empty string

    useEffect(() => {
        if (isOpen && projectId) {
            async function fetchMembers() {
                const projectData = await fetchProjectById(projectId);
                setMembers(projectData.members);
                if (projectData.members.length > 0) {
                    setSelectedUserId(projectData.members[0]._id); // Initialize to the first member's id or you can choose another logic
                }
            }
            fetchMembers();
        } else {
            setSelectedUserId(""); // Reset to empty string when modal is not open
        }
    }, [isOpen, projectId]);

    const handleAdd = () => {
        if (selectedUserId) {
            onAdd(selectedUserId);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div>
            <h3>Add Assignee</h3>
            <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
                {members.map(member => {
                    if (!member._id) {
                        console.warn("Skipping member without _id:", member);
                        return null; // Return null to skip rendering this option
                    }

                    return (
                        <option key={member._id} value={member._id}>
                            {member.name}
                        </option>
                    );
                })}
            </select>
            <button onClick={handleAdd}>Add</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
}

export default AddAssigneeModal;