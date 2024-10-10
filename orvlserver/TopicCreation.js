const express = require("express");
const router = express.Router();
const db = require("./database"); // Ensure this points to your database connection
 
// Route to fetch exam name, subject name, and topic name
router.get('/fetch-exam-subject-topic', async (req, res) => {
    const sql = `
      SELECT
    e.exam_id,
    e.exam_name,
    s.subject_name,
    t.topic_id,  -- Include topic_id here
    GROUP_CONCAT(t.topic_name ORDER BY t.topic_name SEPARATOR ', ') AS topics
FROM
    topics t
JOIN
    exams e ON t.exam_id = e.exam_id
JOIN
    subjects s ON t.subject_id = s.subject_id
GROUP BY
    e.exam_id, s.subject_name
ORDER BY
    e.exam_name, s.subject_name;
    `;
 
    try {
        const [results] = await db.query(sql); // Using await to handle the promise
        console.log('Fetched topics from DB:', results);
        res.json(results); // Send the results back as a JSON response
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Failed to fetch data' }); // Error handling
    }
});
 // API to fetch topics for the specific subject
router.get('/subjects/:subject_id/topics', async (req, res) => {
    const { subject_id } = req.params;
 
    // Query to fetch topics for the specific subject
    try {
        const [results] = await db.query('SELECT * FROM topics WHERE subject_id = ?', [subject_id]);
 
        if (results.length === 0) {
            return res.status(404).send('No topics found for this subject');
        }
 
        res.json(results);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Failed to fetch topics' });
    }
});
 
 
//POST API
router.post('/submit-topics', async (req, res) => {
    const { topics } = req.body;
 
    // Validate the input
    if (!topics || !Array.isArray(topics) || topics.length === 0) {
        return res.status(400).send('At least one topic must be provided');
    }
 
   
 
    try {
        // Get a connection from the pool
     
        // Use Promise.all to handle multiple insert operations
        const insertPromises = topics.map(topic => {
            return db.query(
                'INSERT INTO topics (exam_id, subject_id, topic_name) VALUES (?, ?, ?)',
                [topic.exam_id, topic.subject_id, topic.topic_name]
            );
        });
 
        // Wait for all insert operations to complete
        await Promise.all(insertPromises);
 
        res.status(200).send('Topics saved successfully');
    } catch (err) {
        console.error('Error saving topics:', err);
        res.status(500).send('Error saving topics');
    }
});
 
// Route to update an exam, subject, or topic
router.put('/topics/update', async (req, res) => {
    const topics = req.body.topics; // Expecting an array of topics
 
    try {
        for (let topic of topics) {
            const { topic_id, topic_name } = topic;
            if (!topic_name) {
                return res.status(400).send('Topic Name is required');
            }
            const updateQuery = 'UPDATE topics SET topic_name = ? WHERE topic_id = ?';
            await db.query(updateQuery, [topic_name, topic_id]);
        }
 
        // Optionally fetch updated topics or return a success message
        res.status(200).json({ message: 'Topics updated successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error updating topics: ' + err.message);
    }
});
 
 
// Delete API
router.delete('/topics/delete/:topic_id', async (req, res) => {
    const topic_id = req.params.topic_id; // Change from subject_id to topic_id
    console.log('Received topic_id for deletion:', topic_id); // Log the ID
    try {
        // Execute the delete query
        const results = await db.query('DELETE FROM topics WHERE topic_id = ?', [topic_id]);
 
        console.log('Delete results:', results); // Log results from the delete operation
       
        if (results.affectedRows === 0) {
            return res.status(404).send('Topic not found'); // Handle case where no rows were deleted
        }
 
        res.status(204).send(); // No content to send back
    } catch (err) {
        console.error('Error deleting topic:', err);
        return res.status(500).send('Error deleting topic');
    }
   
});
// Route to fetch a specific topic by its ID
router.get('/topics/:topic_id', async (req, res) => {
    const topic_id = req.params.topic_id;
 
    const fetchQuery = `
        SELECT * FROM topics WHERE exam_id = (
            SELECT exam_id FROM topics WHERE topic_id = ?
        ) AND subject_id = (
            SELECT subject_id FROM topics WHERE topic_id = ?
        )
    `;
 
    try {
        const [topics] = await db.query(fetchQuery, [topic_id, topic_id]);
        res.json(topics);
    } catch (err) {
        console.error('Error fetching topics:', err);
        res.status(500).send('Error fetching topics');
    }
});
 
 
// Export the router
module.exports = router;
 
 