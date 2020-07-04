const express = require('express');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const multer = require('multer');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
const crypto = require('crypto');
require('colors');
const errorHandler = require('./middlewares/error');
const asyncHandler = require('./middlewares/async');

const app = express();
app.use(express.json());

app.use(methodOverride('_method'));

dotenv.config({ path: './config.env' });

const connectDB = require('./db');
connectDB();
const Project = require('./model/Project');
const project = require('./routes/project');

// ==========SHIT STARTS HERE
let conn = mongoose.connection;
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({

  url: process.env.MONGO_URI,

  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  },

  options: {
    useUnifiedTopology: true
  }

});

const upload = multer({ storage });

// app.post('/upload', upload.single('file'), (req, res) => {
//     res.status(201).json({ success: true, data: req.file })
// })

// app.get('/upload', (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     // Check if files
//     if (!files || files.length === 0) {
//       return res.status(404).json({
//         err: 'No files exist'
//       });
//     }

//     // Files exist
//     return res.status(200).json({ success: true, count: files.length, files });
//   });
// });

// app.get('/image/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       });
//     }

//     // Check if image
//     if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
//       // Read output to browser
//       const readstream = gfs.createReadStream(file.filename);
//       readstream.pipe(res);
//     } else {
//       res.status(404).json({
//         err: 'Not an image'
//       });
//     }
//   });
// });

// app.delete('/files/:id', (req, res) => {
//   gfs.remove({ _id: req.params.id, root: 'uploads' }, (err) => {
//     if (err) {
//       return res.status(404).json({ err: err });
//     }

//     res.status(200).json({ success: true, msg: 'File deleted' });
//   });
// });


// =======SHIT ENDS HERE

app.put('/project/:id/upload', upload.single('file'), asyncHandler(
  async (req, res) => {
    const project = await Project.findById(req.params.id);
  
    if(!project){
      return res.status(404).json({ success: false, msg: 'No such project found' })
    }
  
    project.image = req.file;
  
    await project.save();
  
    return res.status(201).json({ success: true, data: project })
  }
))

app.get('/project/:id/image/:filename', asyncHandler(
  async (req, res) => {
    const project = await Project.findById(req.params.id);
  
    if(!project){
      return res.status(404);
    }
  
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  }
));

app.use('/project', project);


app.get('/', (req, res) => {
  res.send('Api up and running')
})

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`.green.bold);
})