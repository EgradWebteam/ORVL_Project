const express = require('express');  
const mysql = require('mysql2');   
const bodyParser = require('body-parser');
const cors = require('cors');  // Import cors middleware

const app = express();   
const port = 8000;

app.use(bodyParser.json());        

// Configure CORS to allow requests from your React frontend (running on localhost:3000)
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests only from this origin
    methods: ['GET', 'POST'],  // Allow only GET and POST requests
    allowedHeaders: ['Content-Type'],  // Allow Content-Type header
}));

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
// // Fetch topics for a specific subject
// app.get('/api/subjects/:subject_id/topics', (req, res) => {
//     const subject_id = req.params.subject_id;
//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.error('MySQL Connection Error:', err);
//             return res.status(500).send('Database connection error');
//         }
//         connection.query('SELECT * FROM topics WHERE subject_id = ?', [subject_id], (err, results) => {
//             connection.release();
//             if (err) {
//                 console.error('Error fetching topics:', err);
//                 return res.status(500).send('Error fetching topics');
//             }
//             res.json(results);
//         });
//     });
// });

app.post('/api/submit-selection', (req, res) => {
    const { exam_id, selectedsubjects, selectedtopics } = req.body;

    if (!exam_id || !selectedsubjects || !Array.isArray(selectedsubjects) || selectedsubjects.length === 0 || !selectedtopics || !Array.isArray(selectedtopics) || selectedtopics.length === 0) {
        return res.status(400).send('Exam, subjects, and topics must be provided and should be non-empty arrays');
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).send('Database connection error');
        }

        const insertSubjectPromises = selectedsubjects.map((subject_id) => {
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

        const insertTopicPromises = selectedtopics.map((topic) => {
            return new Promise((resolve, reject) => {
                connection.query(
                    'INSERT INTO topics (name, subject_id) VALUES (?, ?)',
                    [topic.name, topic.subject_id],
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

        Promise.all([...insertSubjectPromises, ...insertTopicPromises])
            .then(() => {
                connection.release();
                res.status(200).send('Selection and topics saved successfully');
            })
            .catch((err) => {
                connection.release();
                console.error('Error saving selection or topics:', err);
                res.status(500).send('Error saving selection or topics');
            });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
