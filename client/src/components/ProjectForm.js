import React, { useState } from 'react';
import { createProject } from '../services/apiService';
import './ProjectForm.css';

function ProjectForm() {
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createProject({ name });
        setName('');
    }

    return (
        <form className="project-form" onSubmit={handleSubmit}>
            <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Project name"
            />
            <button type="submit">Add Project</button>
        </form>
    );
}

export default ProjectForm;
