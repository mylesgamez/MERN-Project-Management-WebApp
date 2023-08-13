// ProjectList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../services/apiService';
import './ProjectList.css';

function ProjectList() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetchProjects();
                setProjects(response);
            } catch (error) {
                console.error("Error loading projects:", error);
            }
        }
        loadData();
    }, []);

    return (
        <div className="project-list">
            <h2>Projects</h2>
            <ul>
                {projects.map(project => (
                    <li key={project._id}>
                        <Link to={`/project/${project._id}`}>{project.name}</Link>
                        <span> (Status: {project.status})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProjectList;
