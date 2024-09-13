const express = require('express');  
const mysql = require('mysql2');  
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
 
const app = express();  
const port = 8000;
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));      
 
// Configure CORS to allow requests from your React frontend (running on localhost:3000)
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests only from this origin
    methods: ['GET', 'POST'],  // Allow only GET and POST requests
    allowedHeaders: ['Content-Type'],  // Allow Content-Type header
}));
 // Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'orvl_project_database'
});
 
// Route to fetch all exams
app.get('/api/exams', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).send('Database connection error');
        }
        connection.query('SELECT * FROM exams', (err, results) => {
            connection.release();  // Release connection back to the pool
            if (err) {
                console.error('Error fetching exams:', err);
                return res.status(500).send('Error fetching exams');
            }
            res.json(results);  
        });
    });
});
 
// Route to fetch subjects for a specific exam
app.get('/api/exam/:exam_id/subjects', (req, res) => {
    const exam_id = req.params.exam_id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).send('Database connection error');
        }
        connection.query('SELECT * FROM subjects WHERE exam_id = ?', [exam_id], (err, results) => {
            connection.release();  // Release connection back to the pool
            if (err) {
                console.error('Error fetching subjects:', err);
                return res.status(500).send('Error fetching subjects');
            }
            res.json(results);
        });
    });
});
 
// Fetch topics for a specific subject
app.get('/api/subjects/:subject_id/topics', (req, res) => {
    const subject_id = req.params.subject_id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('MySQL Connection Error:', err);
            return res.status(500).send('Database connection error');
        }
        connection.query('SELECT * FROM topics WHERE subject_id = ?', [subject_id], (err, results) => {
            connection.release();
            if (err) {
                console.error('Error fetching topics:', err);
                return res.status(500).send('Error fetching topics');
            }
            res.json(results);
        });
    });
});
 
// Route to handle form submission
app.post('/api/submit-selection', (req, res) => {
    const { exam_id, selectedsubjects } = req.body;  // Destructure examId and selected subjects from the request body
 
    if (!exam_id || !selectedsubjects || selectedsubjects.length === 0) {
        return res.status(400).send('Exam and at least one subject must be selected');
    }
 
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).send('Database connection error');
        }
 
        // Loop through each selected subject and insert it into the Selections table
        const insertPromises = selectedsubjects.map((subject_id) => {
            return new Promise((resolve, reject) => {
                connection.query(
                    'INSERT INTO selections (exam_id, subject_id) VALUES (?, ?)',
                    [exam_id, subject_id],
                    (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    }
                );
            });
        });
 
        Promise.all(insertPromises)
            .then(() => {
                connection.release();  // Release connection back to the pool
                res.status(200).send('Selection saved successfully');
            })
            .catch((err) => {
                connection.release();  // Release connection even if there's an error
                console.error('Error saving selection:', err);
                res.status(500).send('Error saving selection');
            });
    });
});
 
// Route to handle topics submission
// Route to handle topics submission
app.post('/api/submit-topics', (req, res) => {
    const { topics } = req.body;  // Extract topics from the request body

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
        return res.status(400).send('At least one topic must be provided');
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).send('Database connection error');
        }

        // Loop through each topic and insert it into the Topics table
        const insertPromises = topics.map((topic) => {
            return new Promise((resolve, reject) => {
                connection.query(
                    'INSERT INTO topics (exam_id, subject_id, topic_name) VALUES (?, ?, ?)',
                    [topic.exam_id, topic.subject_id, topic.topic_name],
                    (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    }
                );
            });
        });

        Promise.all(insertPromises)
            .then(() => {
                connection.release();  // Release connection back to the pool
                res.status(200).send('Topics saved successfully');
            })
            .catch((err) => {
                connection.release();  // Release connection even if there's an error
                console.error('Error saving topics:', err);
                res.status(500).send('Error saving topics');
            });
    });
});
/// Route to upload an image for an exam
app.post('/api/exam/:exam_id/upload-image', upload.single('image'), (req, res) => {
    const exam_id = req.params.exam_id;
    const image_filename = req.file.filename;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).send('Database connection error');
        }

        connection.query('INSERT INTO exam_images (exam_id, image_filename) VALUES (?, ?)', [exam_id, image_filename], (err, results) => {
            connection.release();
            if (err) {
                console.error('Error saving image details:', err);
                return res.status(500).send('Error saving image details');
            }
            res.status(200).send('Image uploaded successfully');
        });
    });
});

// Route to fetch images for a specific exam
app.get('/api/exam/:exam_id/images', (req, res) => {
    const exam_id = req.params.exam_id;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).send('Database connection error');
        }

        connection.query('SELECT image_filename FROM exam_images WHERE exam_id = ?', [exam_id], (err, results) => {
            connection.release();
            if (err) {
                console.error('Error fetching images:', err);
                return res.status(500).send('Error fetching images');
            }
            res.json(results.map(row => ({ image_url: `http://localhost:8000/uploads/${row.image_filename}` })));
        });
    });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
 