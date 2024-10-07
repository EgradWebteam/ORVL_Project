const express = require("express");
const router = express.Router();
const db = require("./database"); // Ensure this points to your database connection


router.get('/videos/:videoId', async (req, res) => {
    const videoId = req.params.videoId;

    try {
         // Use await to get the connection
        const query = `
            SELECT
                v.video_id,
                t.topic_id,
                e.exam_id,
                s.subject_id,
                e.exam_name,
                s.subject_name,
                t.topic_name,
                v.video_name,
                v.video_link
            FROM videos v
            JOIN exams e ON v.exam_id = e.exam_id
            JOIN subjects s ON v.subject_id = s.subject_id
            JOIN topics t ON v.topic_id = t.topic_id
            WHERE v.video_id = ?;`;

        const [results] = await db.query(query, [videoId]); // Use await for the query

      

        if (results.length === 0) {
            return res.status(404).json({ error: 'Video not found' });
        }

        res.status(200).json(results[0]); // Send the first result
    } catch (err) {
        console.error('Error fetching video:', err);
        res.status(500).json({ error: 'Error fetching video' });
    }
});

router.get('/video-overview', async (req, res) => {
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
                GROUP_CONCAT(v.video_name ORDER BY v.video_name) AS video_names,
                GROUP_CONCAT(v.video_link ORDER BY v.video_name) AS video_links
            FROM videos v
            JOIN exams e ON v.exam_id = e.exam_id
            JOIN subjects s ON v.subject_id = s.subject_id
            JOIN topics t ON v.topic_id = t.topic_id
            GROUP BY e.exam_name, s.subject_name, t.topic_name
        `;

        const [results] = await db.query(query); // Use await for the query

        
        res.status(200).json(results); // Send the results
    } catch (err) {
        console.error('Error fetching video overview:', err);
        res.status(500).json({ error: 'Error fetching video overview' });
    }
});






// Export the router
module.exports = router;