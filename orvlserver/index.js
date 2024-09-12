const express = require('express');  
const mysql = require('mysql2');   
const bodyParser = require('body-parser'); 

const app = express();   
const port = 8000;
app.use(bodyParser.json());        

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
