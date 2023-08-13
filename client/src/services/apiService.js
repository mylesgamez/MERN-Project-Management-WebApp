const BASE_URL = "http://localhost:5000/api";

// Helper function to get token from local storage
const getToken = () => {
    return localStorage.getItem('token');  // You can choose the storage key you want
}

export const fetchProjects = async () => {
    const response = await fetch(`${BASE_URL}/projects`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
    }

    const data = await response.json();
    return data;
}

export const createProject = async (project) => {
    const response = await fetch(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(project),
    });
    const data = await response.json();
    return data;
}

export const registerUser = async (userData) => {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
    }

    const data = await response.json();
    localStorage.setItem('token', data.token); // Save token
    return data;
}

export const loginUser = async (email, password) => {
    const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.status !== 200) {
        throw new Error("Failed to login");
    }

    const data = await response.json();
    return data;
}

export const logoutUser = async () => {
    // This method can contact the backend to invalidate the token, or simply remove it from the client side
    localStorage.removeItem('token');
}

export const fetchTasksByProject = async (projectId) => {
    const response = await fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
    }

    const data = await response.json();
    return data;
}

export const createTaskForProject = async (taskData) => {
    const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
    }

    const data = await response.json();
    return data;
}

// For updating task progress.
export const updateTaskProgress = async (taskId, progressData) => {
    // Update task progress using PATCH or PUT request.
}

export const fetchProjectById = async (projectId) => {
    try {
        const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch project");
        }
        const data = await response.json();
        console.log("Fetched Project Data:", data);  // Add this line
        return data;
    } catch (error) {
        console.error("Error fetching project by ID:", error);
        throw error;
    }
}

export const fetchTaskById = async (taskId) => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
    }

    const data = await response.json();
    console.log("Fetched Task Data:", data);  // Add this line
    return data;
}

export const updateTask = async (taskId, taskData) => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData),
    });
    const data = await response.json();
    return data;
}

export const deleteTask = async (taskId) => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        return { success: true };
    } else {
        const data = await response.json();
        return { success: false, error: data.error };
    }
}

export const addAssigneeToTask = async (taskId, userId) => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}/addAssignee`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding assignee:", errorData);
        // Check if the error message exists in the errorData, otherwise use a default message.
        throw new Error(errorData.message || "Failed to add assignee");
    }

    const data = await response.json();
    return data;
}

export const removeAssigneeFromTask = async (taskId, userId) => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}/removeAssignee`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error removing assignee:", errorData);
        // Check if the error message exists in the errorData, otherwise use a default message.
        throw new Error(errorData.message || "Failed to remove assignee");
    }
    const data = await response.json();
    return data;
}

export const fetchUserIdFromToken = async () => {
    const response = await fetch(`${BASE_URL}/users/me`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
    }

    const data = await response.json();
    return data._id;  // We are getting the userId from the user object here
}

export const fetchUserById = async (id) => {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
    }

    const data = await response.json();
    return data;  // This returns the entire user object, so we can extract the name in the component
}

export const updateProject = async (projectId, projectData) => {
    const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
    }

    const data = await response.json();
    return data;
}
