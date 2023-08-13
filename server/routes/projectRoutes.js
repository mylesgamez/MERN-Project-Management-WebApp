const express = require('express');
const Project = require('../models/project');

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
    try {
        const project = new Project({
            ...req.body,
            createdBy: req.userId
        });
        await project.save();
        console.log("Project saved successfully:", project);
        res.status(201).send(project);
    } catch (error) {
        console.error("Error saving project:", error);
        res.status(400).send(error);
    }
});

router.get('/', authMiddleware, async (req, res) => {
    console.log("Inside GET /projects route handler");
    try {
        const projects = await Project.find();
        res.status(200).send(projects);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving projects." });
    }
});

// Single project fetch route by ID.
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('createdBy').populate('members');
        if (!project) {
            return res.status(404).send({ message: "Project not found." });
        }
        res.status(200).send(project);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving project." });
    }
});

// Update project by ID
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) {
            return res.status(404).send({ message: "Project not found." });
        }
        res.status(200).send(project);
    } catch (error) {
        res.status(500).send({ message: "Error updating project." });
    }
});

module.exports = router;
