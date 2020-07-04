const Project = require('../model/Project');
const asyncHandler = require('../middlewares/async');

// @desc Add Project
// @route POST /project
exports.addProject = asyncHandler(
    async (req, res) => {
        try {
            const project = await Project.create(req.body);
            return res.status(201).json({ success: true, data: project });  
        } catch (err) {
            console.error(`${err}.red.bold`)
        }
      }
)

// @desc Get All Projects
// @route GET /project
exports.getAllProjects = asyncHandler(
    async (req, res) => {
        try {
            const projects = await Project.find().sort();
            projects.reverse();
            return res.status(201).json({ success: true, count: projects.length, data: projects }); 
        } catch (err) {
            console.error(`${err}.red.bold`)
        }
      }
)

// @desc Delete Project
// @route DELETE /project/:id
exports.deleteProject = asyncHandler(
    async (req, res) => {
        try {
            await Project.findByIdAndDelete(req.params.id);

            return res.status(201).json({ success: true, msg: 'Project Deleted Successfuly' }); 
        } catch (err) {
            console.error(`${err}.red.bold`)
        }
      }
)