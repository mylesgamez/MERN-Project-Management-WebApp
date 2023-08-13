import React, { useState, useEffect } from 'react';
import {
    fetchTaskById,
    fetchProjectById,
    fetchUserIdFromToken,
    updateTask,
    addAssigneeToTask,
    removeAssigneeFromTask,
    fetchUserById
} from '../services/apiService.js';
import './ViewTask.css';
import { useParams } from 'react-router-dom';
import AddAssigneeModal from './AddAssigneeModal';

function ViewTask() {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [project, setProject] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddAssigneeModal, setShowAddAssigneeModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const taskData = await fetchTaskById(taskId);

            // Check if taskData has assignee and it's not null
            if (taskData.assignee && taskData.assignee._id) {
                const assigneeData = await fetchUserById(taskData.assignee._id);
                taskData.assignee = assigneeData;
            }

            setTask(taskData);

            const projectData = await fetchProjectById(taskData.projectId);
            setProject(projectData);

            // Fetch current user's ID from backend
            const fetchedUserId = await fetchUserIdFromToken();
            setUserId(fetchedUserId);
        }
        fetchData();
    }, [taskId]);

    if (!task || !project || !userId) return <div>Loading...</div>;

    const isUserAMemberOrCreator = project.members.some(member => member._id === userId)
        || project.createdBy._id === userId;

    const isUserAnAssignee = task.assignee && task.assignee._id === userId;

    const handleTaskEdit = async (e) => {
        e.preventDefault();
        // Call the API to update the task details
        const updatedTask = await updateTask(taskId, task);
        setTask(updatedTask);
        setIsEditing(false);
    }

    const handleAddAssignee = async (userId) => {
        const updatedTask = await addAssigneeToTask(taskId, userId);
        setTask(updatedTask);
    }

    return (
        <div className="task-view-container">
            {(isUserAnAssignee || isUserAMemberOrCreator) &&
                <button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit"}
                </button>
            }
            <h3>{task.title}</h3>
            <p>Description: {task.description}</p>
            <p>Status: {task.status}</p>
            <p>Assigned to: {task.assignee ? task.assignee.name : "No one"}</p>
            {isUserAMemberOrCreator && (
                <>
                    <button onClick={() => setShowAddAssigneeModal(true)}>Add Assignee</button>
                    <AddAssigneeModal
                        isOpen={showAddAssigneeModal}
                        onClose={() => setShowAddAssigneeModal(false)}
                        onAdd={handleAddAssignee}
                        projectId={task.projectId}
                    />
                </>
            )}
            {isEditing &&
                <div>
                    <form onSubmit={handleTaskEdit}>
                        <input value={task.title} onChange={e => setTask({ ...task, title: e.target.value })} />
                        <textarea value={task.description} onChange={e => setTask({ ...task, description: e.target.value })}></textarea>
                        <select value={task.status} onChange={e => setTask({ ...task, status: e.target.value })}>
                            <option value="Incomplete">Incomplete</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            }
        </div>
    );
}

export default ViewTask;
