const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/task');
const Project = require('../models/project');
const User = require('../models/user');
const mongoose = require('mongoose');

const router = express.Router();

router.post('/tasks', authMiddleware, async (req, res) => {
    try {
        if (!req.body.projectId) {
            return res.status(400).send({ error: 'Project ID is required to create a task.' });
        }

        const task = new Task({
            ...req.body,
            createdBy: req.userId
        });
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/projects/:projectId/tasks', authMiddleware, async (req, res) => {
    const projectId = req.params.projectId;
    try {
        const tasks = await Task.find({ projectId });
        if (!tasks.length) {
            return res.status(404).send({ message: "Tasks not found for the given project." });
        }
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving tasks." });
    }
});

router.get('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignee');
        if (!task) {
            return res.status(404).send({ message: "Task not found." });
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving task." });
    }
});

router.put('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // return the updated task
            runValidators: true // validate the updated document
        });

        if (!task) {
            return res.status(404).send({ message: "Task not found." });
        }

        res.status(200).send(task);
    } catch (error) {
        res.status(400).send({ message: "Error updating task." });
    }
});

router.delete('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send({ message: "Task not found." });
        }

        res.status(200).send({ message: "Task deleted successfully." });
    } catch (error) {
        res.status(500).send({ message: "Error deleting task." });
    }
});

router.post('/tasks/:id/addAssignee', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.body;

        // Validate the userId exists in the database before trying to set it
        const validUserId = mongoose.isValidObjectId(userId) && await User.findById(userId);
        if (!validUserId) {
            return res.status(400).send({ message: "Invalid user ID." });
        }

        const task = await Task.findByIdAndUpdate(req.params.id, { assignee: userId }, {
            new: true,
            runValidators: true
        }).populate('assignee');  // Populate assignee to return with user details

        if (!task) {
            return res.status(404).send({ message: "Task not found." });
        }

        res.status(200).send(task);
    } catch (error) {
        console.error("Error adding assignee:", error);
        res.status(500).send({ message: "Error adding assignee to task." });
    }
});

module.exports = router;
