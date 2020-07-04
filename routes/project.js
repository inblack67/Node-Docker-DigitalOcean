const express = require('express');
const router = express.Router();
const { addProject, getAllProjects, deleteProject } = require('../controllers/project');

router
.post('/', addProject)
.get('/', getAllProjects)
.delete('/:id', deleteProject)

module.exports = router;