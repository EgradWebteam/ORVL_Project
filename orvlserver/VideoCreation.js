const express = require("express");
const router = express.Router();
const db = require("./database"); // Ensure this points to your database connection
 
// Route to fetch video name and link based on topic_id
router.get('/topics/:topic_id/videos', async (req, res) => {
    const { topic_id } = req.params;
 
    try {
        // Query to fetch video details for the specific topic
        const [results] = await db.query('SELECT video_name, video_link FROM videos WHERE topic_id = ?', [topic_id]);
 
        if (results.length === 0) {
            return res.status(404).send('No videos found for this topic');
        }
 
        res.json(results);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});
 
// Route to fetch all videos with exam, subject, and topic details
router.get('/fetch-videos', async (req, res) => {
    try {
        const query = `
           SELECT
            v.video_id,
            t.topic_id,
            e.exam_id,
            s.subject_id,
                   e.exam_name,
                   s.subject_name,
                   t.topic_name,
                   GROUP_CONCAT(v.video_name ORDER BY v.video_name ) AS video_names,
               GROUP_CONCAT(v.video_link ORDER BY v.video_name ) AS video_links
            FROM videos v
            JOIN exams e ON v.exam_id = e.exam_id
            JOIN subjects s ON v.subject_id = s.subject_id
            JOIN topics t ON v.topic_id = t.topic_id
            GROUP BY e.exam_name, s.subject_name, t.topic_name
        `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Error fetching videos' });
    }
});
 
// POST route to save video links
router.post('/create-videos', async (req, res) => {
    const { videos } = req.body; // Expecting an array of video objects
 
    // Check if videos array is provided
    if (!Array.isArray(videos) || videos.length === 0) {
        return res.status(400).json({ error: 'Videos array is required' });
    }
 
    try {
        // Prepare SQL statement for inserting videos
        const insertQuery = `
            INSERT INTO videos (exam_id, subject_id, topic_id, video_name, video_link)
            VALUES (?, ?, ?, ?, ?)
        `;
 
        const promises = videos.map(video => {
            const { exam_id, subject_id, topic_id, video_name, video_link } = video;
            return db.query(insertQuery, [exam_id, subject_id, topic_id, video_name, video_link]);
        });
 
        // Execute all insert promises
        await Promise.all(promises);
 
        res.status(201).json({ message: 'Videos saved successfully' });
    } catch (err) {
        console.error('Error saving videos:', err);
        res.status(500).json({ error: 'Error saving videos' });
    }
});
 
// Update video details
router.put('/update-videos/:videoId', async (req, res) => {
    const { videoId } = req.params;
    const { exam_id, subject_id, topic_id, video_name, video_link } = req.body;
 
    try {
        const updateQuery = `
            UPDATE videos
            SET exam_id = ?, subject_id = ?, topic_id = ?, video_name = ?, video_link = ?
            WHERE video_id = ?
        `;
        await db.query(updateQuery, [exam_id, subject_id, topic_id, video_name, video_link, videoId]);
 
        res.status(200).json({ message: 'Video updated successfully' });
    } catch (err) {
        console.error('Error updating video:', err);
        res.status(500).json({ error: 'Error updating video' });
    }
});
 
// Delete a video
router.delete('/delete-videos/:videoId', async (req, res) => {
    const { videoId } = req.params;
 
    try {
        const deleteQuery = 'DELETE FROM videos WHERE video_id = ?';
        await db.query(deleteQuery, [videoId]);
 
        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (err) {
        console.error('Error deleting video:', err);
        res.status(500).json({ error: 'Error deleting video' });
    }
});
 
// Export the router
module.exports = router;
 
 