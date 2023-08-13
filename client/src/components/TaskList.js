import React from 'react';

const TaskList = ({ projectId, tasks, loading }) => {
    return (
        <div className="task-list-container">
            <h4>Tasks</h4>
            {loading ? (
                <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <p>No tasks available. Add some!</p>
            ) : (
                <ul>
                    {tasks.map(task => (
                        <li key={task._id} onClick={() => window.location.replace(`/task/${task._id}`)}>
                            <h5>{task.title}</h5>
                            <p>{task.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TaskList;
