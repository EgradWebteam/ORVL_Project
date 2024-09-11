const express = require('express');  
const mysql = require('mysql2');   
const bodyParser = require('body-parser'); 

const app = express();   
const port = 3000;
app.use(bodyParser.json());        


// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'orvl_project_database'
});

// Get a connection from the pool
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL');
    connection.release(); // Release the connection back to the pool
});
// Route to fetch all exams
app.get('/api/exams', (req, res) => {
    connection.query('SELECT * FROM exams', (err, results) => {
        if (err) {
            console.error('Error fetching exams:', err);
            res.status(500).send('Error fetching exams');
            return;
        }
        res.json(results);  
    });
});

//Route to fetch subjects for a specific exam
app.get('api/exam/:exam_id/subjects',(req,res)=>{
    const exam_id = req.params.exam_id;
    connection.query('SELECT * FROM subjects WHERE exam_id = ?', [exam_id]),(err,results)=>{
        if(err){
            console.error('Error fetching subjects:',err);
            res.status(500).send('Error fetching subjects');
            return;
        }
        res.json(results);
    }
});
//Route to handle form submission
app.post('/api/submit-selection', (req, res) => {
    const { exam_id, selectedsubjects } = req.body;  // Destructure examId and selected subjects from the request body

    if (!exam_id || !selectedsubjects || selectedsubjects.length === 0) {
        return res.status(400).send('Exam and at least one subject must be selected');
    }

    // Loop through each selected subject and insert it into the Selections table
    selectedsubjects.forEach((subject_id) => {
        connection.query(
            'INSERT INTO selections ( exam_id,subject_id) VALUES (?, ?)',
            [exam_id, subject_id],
            (err, results) => {
                if (err) {
                    console.error('Error inserting selection:', err);
                    return res.status(500).send('Error saving selection');
                }
            }
        );
    });

    res.status(200).send('Selection saved successfully');  // Send a success message after saving the selection
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});