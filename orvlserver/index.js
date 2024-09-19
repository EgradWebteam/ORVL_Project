const express = require('express');
const mysql = require('mysql2');  
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const router = express.Router();
 
 
const app = express();
const port = 8000;
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow these HTTP methods
    allowedHeaders: ['Content-Type'],  // Allow these headers
}));
 
 
 
 
// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'orvl_project_database'
});
const promisePool = pool.promise(); // Use promisePool for async/await
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('public/uploads'));
 
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
 
// // Route to handle form submission
// app.post('/api/submit-selection', (req, res) => {
//     const { exam_id, selectedsubjects } = req.body;
 
//     if (!exam_id || !selectedsubjects || selectedsubjects.length === 0) {
//         return res.status(400).send('Exam and at least one subject must be selected');
//     }
 
//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.error('Error connecting to MySQL:', err);
//             return res.status(500).send('Database connection error');
//         }
 
//         const insertPromises = selectedsubjects.map((subject_id) => {
//             return new Promise((resolve, reject) => {
//                 connection.query(
//                     'INSERT INTO selections (exam_id, subject_id) VALUES (?, ?)',
//                     [exam_id, subject_id],
//                     (err, results) => {
//                         if (err) {
//                             reject(err);
//                         } else {
//                             resolve(results);
//                         }
//                     }
//                 );
//             });
//         });
 
//         Promise.all(insertPromises)
//             .then(() => {
//                 connection.release();
//                 res.status(200).send('Selection saved successfully');
//             })
//             .catch((err) => {
//                 connection.release();
//                 console.error('Error saving selection:', err);
//                 res.status(500).send('Error saving selection');
//             });
//     });
// });
 // Route to handle form submission or fetch selections
app.route('/api/submit-selection')
.post((req, res) => {
    const { exam_id, selectedsubjects } = req.body;
 
    if (!exam_id || !selectedsubjects || selectedsubjects.length === 0) {
        return res.status(400).send('Exam and at least one subject must be selected');
    }
 
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).send('Database connection error');
        }
 
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
                connection.release();
                res.status(200).send('Selection saved successfully');
            })
            .catch((err) => {
                connection.release();
                console.error('Error saving selection:', err);
                res.status(500).send('Error saving selection');
            });
    });
})
.get((req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).send('Database connection error');
        }
 
        const query = `
            SELECT e.exam_id, e.exam_name, GROUP_CONCAT(sub.subject_name SEPARATOR ', ') AS subjects
            FROM selections s
            JOIN exams e ON s.exam_id = e.exam_id
            JOIN subjects sub ON s.subject_id = sub.subject_id
            GROUP BY e.exam_id, e.exam_name
        `;
 
        connection.query(query, (err, results) => {
            connection.release();
            if (err) {
                console.error('Error fetching selections:', err);
                return res.status(500).send('Error fetching selections');
            }
            res.status(200).json(results);
        });
    });
});
 
// Route to handle topics submission
app.post('/api/submit-topics', (req, res) => {
    const { topics } = req.body;
 
    if (!topics || !Array.isArray(topics) || topics.length === 0) {
        return res.status(400).send('At least one topic must be provided');
    }
 
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).send('Database connection error');
        }
 
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
                connection.release();
                res.status(200).send('Topics saved successfully');
            })
            .catch((err) => {
                connection.release();
                console.error('Error saving topics:', err);
                res.status(500).send('Error saving topics');
            });
    });
});
 
// Route to handle adding video details
app.post('/api/submit-videos', (req, res) => {
    const { videos } = req.body;
 
    if (!videos || !Array.isArray(videos) || videos.length === 0) {
        return res.status(400).json({ error: 'No videos provided' });
    }
 
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).json({ error: 'Database connection error' });
        }
 
        const insertPromises = videos.map(video => {
            return new Promise((resolve, reject) => {
                connection.query(
                    'INSERT INTO videos (exam_id, subject_id, topic_id, video_name, video_link) VALUES (?, ?, ?, ?, ?)',
                    [video.exam_id, video.subject_id, video.topic_id, video.video_name, video.video_link],
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
                connection.release();
                res.status(200).json({ message: 'Videos added successfully' });
            })
            .catch((err) => {
                connection.release();
                console.error('Error adding videos:', err);
                res.status(500).json({ error: 'Error adding videos' });
            });
    });
});
 
// Route to fetch videos for a specific topic
app.get('/api/videos/:topic_id', (req, res) => {
    const topicId = req.params.topic_id;
 
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).json({ error: 'Database connection error' });
        }
 
        const query = 'SELECT video_id, video_name, video_link FROM videos WHERE topic_id = ?';
 
        connection.query(query, [topicId], (err, results) => {
            connection.release();
            if (err) {
                console.error('Error fetching videos:', err);
                return res.status(500).json({ error: 'Error fetching videos', details: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'No videos found for the given topic ID' });
            }
            res.json(results);
        });
    });
});
 
 // Route to fetch videos for a specific exam, subject, and topic
// app.get('/api/videos', (req, res) => {
//     const { examId, subjectId, topicId } = req.query;
 
//     if (!examId || !subjectId || !topicId) {
//         return res.status(400).json({ error: 'Missing required query parameters' });
//     }
 
//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.error('Error connecting to MySQL:', err);
//             return res.status(500).json({ error: 'Database connection error' });
//         }
 
//         const query = `
//             SELECT video_id, video_name, video_link
//             FROM videos
//             WHERE exam_id = ? AND subject_id = ? AND topic_id = ?
//         `;
 
//         connection.query(query, [examId, subjectId, topicId], (err, results) => {
//             connection.release();
//             if (err) {
//                 console.error('Error fetching videos:', err);
//                 return res.status(500).json({ error: 'Error fetching videos', details: err.message });
//             }
//             if (results.length === 0) {
//                 return res.status(404).json({ message: 'No videos found for the given parameters' });
//             }
//             res.json(results);
//         });
//     });
// });
 
// Route to fetch selections with exam and subject names
app.get('/api/selections', async (req, res) => {
    try {
        const query = `
           SELECT e.exam_id, e.exam_name, GROUP_CONCAT(sub.subject_name ) AS subjects
            FROM selections s
            JOIN exams e ON s.exam_id = e.exam_id
            JOIN subjects sub ON s.subject_id = sub.subject_id
            GROUP BY e.exam_id, e.exam_name
        `;
 
        const [rows] = await promisePool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching selections:', error);
        res.status(500).json({ error: 'Failed to fetch selections' });
    }
});
// Route to get topics with exam and subject names
 
app.get('/api/topicsr', async (req, res) => {
 
    try {
 
        const query = `
 
            SELECT
 
                exams.exam_name,
 
                subjects.subject_name,
 
                topics.topic_name
 
            FROM topics
 
            JOIN subjects ON topics.subject_id = subjects.subject_id
 
            JOIN exams ON subjects.exam_id = exams.exam_id
 
        `;
 
        const [rows] = await promisePool.query(query);
 
        res.json(rows);  // Send JSON response
 
    } catch (error) {
 
        console.error('Error fetching topics:', error);
 
        res.status(500).send('Error fetching topics');
 
    }
 
});
 // Route to fetch topics with GROUP_CONCAT
app.get('/api/topics', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).send('Database connection error');
        }
 
        const query = `
            SELECT 
                e.exam_name,
                s.subject_name,
                GROUP_CONCAT(t.topic_name ORDER BY t.topic_name ) AS topics
            FROM topics t
            JOIN exams e ON t.exam_id = e.exam_id
            JOIN subjects s ON t.subject_id = s.subject_id
            GROUP BY e.exam_name, s.subject_name
            ORDER BY e.exam_name, s.subject_name;
        `;
 
        connection.query(query, (err, results) => {
            connection.release();
 
            if (err) {
                console.error('Error fetching topics:', err);
                return res.status(500).send('Error fetching topics');
            }
 
            res.status(200).json(results);
        });
    });
});
app.get('/api/videos', async (req, res) => {
    try {
        const query = `
            SELECT
                exams.exam_name,
                subjects.subject_name,
                topics.topic_name,
                videos.video_name,
                videos.video_link
            FROM videos
            JOIN topics ON videos.topic_id = topics.topic_id
            JOIN subjects ON videos.subject_id = subjects.subject_id
            JOIN exams ON videos.exam_id = exams.exam_id
        `;
 
        const [rows] = await promisePool.query(query);
        res.json(rows);  // Send JSON response
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).send('Error fetching videos');
    }
});
//// For uploading multiple videos for a specific topic
// app.post('/api/add-topic-videos', (req, res) => {
//     const { topic_id, videos } = req.body;
   
//     if (!topic_id || !Array.isArray(videos) || videos.length === 0) {
//       return res.status(400).json({ error: 'Invalid input data' });
//     }
   
//     pool.getConnection((err, connection) => {
//       if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return res.status(500).json({ error: 'Database connection error' });
//       }
 
//       const videoValues = videos.map(video => [
//         video.exam_id,
//         video.subject_id,
//         topic_id,
//         video.video_name,
//         video.video_link
//       ]);
 
//       const query = 'INSERT INTO videos (exam_id, subject_id, topic_id, video_name, video_link) VALUES ?';
 
//       connection.query(query, [videoValues], (err, results) => {
//         connection.release();
//         if (err) {
//           console.error('Error inserting videos:', err);
//           return res.status(500).json({ error: 'Failed to add videos' });
//         }
//         res.status(200).json({ message: 'Videos added successfully' });
//       });
//     });
//   });
 
// Route to update a selection
app.put('/api/selections/update/:selection_id', (req, res) => {
    const selection_id = req.params.selection_id;
    const { exam_id, subject_id } = req.body;
 
    if (!exam_id || !subject_id) {
        return res.status(400).send('Exam ID and Subject ID are required');
    }
 
    const query = 'UPDATE selections SET exam_id = ?, subject_id = ? WHERE selection_id = ?';
   
    promisePool.query(query, [exam_id, subject_id, selection_id])
        .then(() => {
            res.status(200).send('Selection updated successfully');
        })
        .catch(error => {
            console.error('Error updating selection:', error);
            res.status(500).send('Error updating selection');
        });
});
 
 
 
// // Route to delete a selection by ID
// app.delete('/api/selections/delete/:selection_id', (req, res) => {
//     const selection_id = req.params.selection_id; // Ensure you're using the correct variable name
//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.error('Error connecting to MySQL:', err);
//             return res.status(500).send('Database connection error');
//         }
 
//         connection.query('DELETE FROM selections WHERE selection_id = ?', [selection_id], (err, results) => {
//             connection.release();
//             if (err) {
//                 console.error('Error deleting selection:', err);
//                 return res.status(500).send('Error deleting selection');
//             }
//             // Check if any rows were affected
//             if (results.affectedRows === 0) {
//                 return res.status(404).send('Selection not found'); // Handle case where no rows were deleted
//             }
//             res.status(204).send();  // No content to send back
//         });
//     });
// });
// app.delete('/api/selections/delete/:selection_id', (req, res) => {
//     const selection_id = req.params.selection_id;
//     console.log('Received selection_id for deletion:', selection_id); // Log the ID
 
//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.error('Error connecting to MySQL:', err);
//             return res.status(500).send('Database connection error');
//         }
 
//         connection.query('DELETE FROM selections WHERE selection_id = ?', [selection_id], (err, results) => {
//             connection.release();
//             if (err) {
//                 console.error('Error deleting selection:', err);
//                 return res.status(500).send('Error deleting selection');
//             }
 
//             console.log('Delete results:', results); // Log results from the delete operation
 
//             if (results.affectedRows === 0) {
//                 return res.status(404).send('Selection not found');
//             }
//             res.status(204).send();  // No content to send back
//         });
//     });
// });
// Route to delete a selection by exam_id
app.delete('/api/selections/delete/:exam_id', (req, res) => {
    const exam_id = req.params.exam_id;
    console.log('Received exam_id for deletion:', exam_id); // Log the ID
 
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).send('Database connection error');
        }
 
        connection.query('DELETE FROM selections WHERE exam_id = ?', [exam_id], (err, results) => {
            connection.release();
            if (err) {
                console.error('Error deleting selection:', err);
                return res.status(500).send('Error deleting selection');
            }
 
            console.log('Delete results:', results); // Log results from the delete operation
 
            if (results.affectedRows === 0) {
                return res.status(404).send('Selection not found'); // Handle case where no rows were deleted
            }
            res.status(204).send();  // No content to send back
        });
    });
});
 
 // Route to update a topic

app.put('/api/topics/update/:topic_id', (req, res) => {

    const topic_id = req.params.topic_id;

    const { exam_id, subject_id, topic_name } = req.body;
 
    if (!exam_id || !subject_id || !topic_name) {

        return res.status(400).send('Exam ID, Subject ID, and Topic Name are required');

    }
 
    const query = 'UPDATE topics SET exam_id = ?, subject_id = ?, topic_name = ? WHERE topic_id = ?';
 
    promisePool.query(query, [exam_id, subject_id, topic_name, topic_id])

        .then(() => {

            res.status(200).send('Topic updated successfully');

        })

        .catch(error => {

            console.error('Error updating topic:', error);

            res.status(500).send('Error updating topic');

        });

});

 
// Route to delete a topic by topic_id

app.delete('/api/topics/delete/:topic_id', (req, res) => {

    const topic_id = req.params.topic_id;

    console.log('Received topic_id for deletion:', topic_id); // Log the ID
 
    pool.getConnection((err, connection) => {

        if (err) {

            console.error('Error connecting to MySQL:', err);

            return res.status(500).send('Database connection error');

        }
 
        connection.query('DELETE FROM topics WHERE topic_id = ?', [topic_id], (err, results) => {

            connection.release();

            if (err) {

                console.error('Error deleting topic:', err);

                return res.status(500).send('Error deleting topic');

            }
 
            console.log('Delete results:', results); // Log results from the delete operation
 
            if (results.affectedRows === 0) {

                return res.status(404).send('Topic not found'); // Handle case where no rows were deleted

            }

            res.status(204).send();  // No content to send back

        });

    });

});

 
 
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});