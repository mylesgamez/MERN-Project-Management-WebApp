import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProjectById, createTaskForProject, fetchUserIdFromToken, updateProject, fetchTasksByProject } from '../services/apiService';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import './ViewProject.css';

function ViewProject() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);

    useEffect(() => {
        async function fetchProjectData() {
            const data = await fetchProjectById(projectId);
            setProject(data);

            // Fetch userId from backend
            const fetchedUserId = await fetchUserIdFromToken();
            setUserId(fetchedUserId);
        }
        async function fetchTasks() {
            try {
                setLoadingTasks(true);
                const tasksData = await fetchTasksByProject(projectId);
                setTasks(tasksData);
                setLoadingTasks(false);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
                setLoadingTasks(false);
            }
        };
        fetchProjectData();
        fetchTasks();
    }, [projectId]);

    if (!project || !userId) return <div>Loading...</div>;

    const isUserAMemberOrCreator = project.members.some(member => member._id === userId)
        || project.createdBy._id === userId;

    const handleCreateTask = async (taskData) => {
        taskData.projectId = projectId;
        const newTask = await createTaskForProject(taskData);
        if (newTask) {
            setModalOpen(false);
            setTasks(prevTasks => [...prevTasks, newTask]);
        }
    };

    const handleProjectEdit = async (e) => {
        e.preventDefault();
        try {
            const updatedProject = await updateProject(projectId, project);
            setProject(updatedProject); // Update state with the updated project
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating project:", error);
            // Optionally, show some feedback to the user
        }
    }

    return (
        <div className="view-project-container">
            {isUserAMemberOrCreator &&
                <button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit"}
                </button>
            }
            {isEditing &&
                <div>
                    <form onSubmit={handleProjectEdit}>
                        <input value={project.name} onChange={e => setProject({ ...project, name: e.target.value })} />
                        <textarea value={project.description} onChange={e => setProject({ ...project, description: e.target.value })}></textarea>
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            }
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <p>Status: {project.status}</p>
            <p>Created by: {project.createdBy ? project.createdBy.name : 'Loading...'}</p>
            <button onClick={() => setModalOpen(true)}>Add New Task</button>
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onCreate={handleCreateTask}
            />
            <TaskList tasks={tasks} loading={loadingTasks} projectId={projectId} />
        </div>
    );
}

export default ViewProject;
