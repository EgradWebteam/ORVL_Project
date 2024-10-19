const express = require("express");
const router = express.Router();
const db = require("./database");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords
const crypto = require('crypto');
const Razorpay = require('razorpay');
// Fetch exam and course details
// API endpoint to get exams with their subjects and course details
router.get('/exams_main', async (req, res) => {
    try {
        const [rows] = await db.query(`
             SELECT
        c.course_creation_id,
        e.exam_name,
        c.exam_id,
        c.course_name,
        c.start_date,
        c.end_date,
        c.cost,
        c.discount,
        c.discount_amount,
        c.total_price,
        c.image,
        COUNT(DISTINCT v.video_id) AS video_count,
        GROUP_CONCAT(s.subject_id SEPARATOR ', ') AS subject_ids,
        GROUP_CONCAT(s.subject_name SEPARATOR ', ') AS subjects
    FROM
        course_creation c
    LEFT JOIN
        exams e ON c.exam_id = e.exam_id
    LEFT JOIN
        course_subjects cs ON c.course_creation_id = cs.course_creation_id
    LEFT JOIN
        subjects s ON cs.subject_id = s.subject_id
    LEFT JOIN
        videos v ON v.subject_id = cs.subject_id
    GROUP BY
        c.course_creation_id;
    `);
 
        if (rows.length > 0) {
            // Convert BLOB to Base64 string for each course
            const coursesWithImages = rows.map(course => {
                if (course.image) {
                    course.image = Buffer.from(course.image).toString('base64');
                }
                return course;
            });
 
            res.json(coursesWithImages);
        } else {
            res.status(404).json({ message: 'No courses found' });
        }
       
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Server error');
    }
});

router.get('/my_courses/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const [rows] = await db.query(`
            SELECT
                c.course_creation_id,
                c.course_name,
                c.start_date,
                c.end_date,
                c.cost,
                c.discount,
                c.total_price,
                c.image,
                e.exam_name,
                GROUP_CONCAT(s.subject_name) AS subject_name,
                COUNT(DISTINCT v.video_id) AS video_count
            FROM
                course_creation c
            JOIN
                buycourse b ON b.course_creation_id = c.course_creation_id
            JOIN
                exams e ON c.exam_id = e.exam_id
            LEFT JOIN
                course_subjects cs ON c.course_creation_id = cs.course_creation_id
            LEFT JOIN
                subjects s ON cs.subject_id = s.subject_id
            LEFT JOIN
                videos v ON v.subject_id = cs.subject_id
            WHERE
                b.user_id = ?
            GROUP BY
                c.course_creation_id;
        `, [userId]);
 
        if (rows.length > 0) {
            const coursesWithImages = rows.map(course => {
                if (course.image) {
                    course.image = Buffer.from(course.image).toString('base64');
                }
                return course;
            });
 
            res.json(coursesWithImages);
        } else {
            res.status(404).json({ message: 'No courses found' });
        }
       
    } catch (error) {
        console.error('Error fetching purchased courses:', error);
        res.status(500).send('Internal Server Error');
    }
});
const checkCoursePurchased = async (req, res, next) => {
    const { userId, courseCreationId } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT * FROM buycourse 
            WHERE user_id = ? AND course_creation_id = ?
        `, [userId, courseCreationId]);

        if (rows.length === 0) {
            return res.status(403).json({ message: 'Access denied: Course not purchased.' });
        }

        next(); // User has purchased the course, proceed to the next middleware/route handler
    } catch (error) {
        console.error('Error checking course purchase:', error);
        res.status(500).send('Server error');
    }
};

// Get course details, topics, and videos by userId and courseCreationId
// router.get('/my_courses/course_details/:userId/:courseCreationId', checkCoursePurchased,  async (req, res) => {
//     const { userId, courseCreationId } = req.params;

//     try {
//         // Fetch course name
//         const [courseRows] = await db.query(`
//             SELECT course_name,course_creation_id
//             FROM course_creation
//             WHERE course_creation_id = ?
//         `, [courseCreationId]);

//         if (courseRows.length === 0) {
//             return res.status(404).json({ message: 'Course not found' });
//         }

//         const courseName = courseRows[0].course_name;
//         const course_creation_id = courseRows[0].course_creation_id;

//         // Fetch topics and videos for the specified course
//         const [topics] = await db.query(`
//             SELECT t.topic_id, t.topic_name,v.video_id,
//                    v.video_name, v.video_link
//             FROM topics t
//             LEFT JOIN videos v ON t.topic_id = v.topic_id
//             WHERE t.subject_id IN (
//                 SELECT subject_id FROM course_subjects WHERE course_creation_id = ?
//             )
//         `, [courseCreationId]);

//         // Organize topics and videos
//         const topicsWithVideos = topics.reduce((acc, topic) => {
//             const { topic_id, topic_name,video_id, video_name, video_link } = topic;

//             // Check if the topic already exists
//             let existingTopic = acc.find(t => t.topic_id === topic_id);
//             if (!existingTopic) {
//                 existingTopic = { topic_id, topic_name,video_id, videos: [] };
//                 acc.push(existingTopic);
//             }

//             // Add the video if it exists
//             if (video_id && video_name && video_link) {
//                 existingTopic.videos.push({ video_id,video_name, video_link });
//             }

//             return acc;
//         }, []);

//         res.json({ courseName,course_creation_id, topics: topicsWithVideos });
//     } catch (error) {
//         console.error('Error fetching course details:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });
// Get course details, topics, and videos by userId and courseCreationId
router.get('/my_courses/course_details/:userId/:courseCreationId', checkCoursePurchased, async (req, res) => {
    const { userId, courseCreationId } = req.params;

    try {
        // Fetch course name
        const [courseRows] = await db.query(
            `SELECT course_name, course_creation_id
            FROM course_creation
            WHERE course_creation_id = ?`, 
            [courseCreationId]
        );

        if (courseRows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const courseName = courseRows[0].course_name;
        const course_creation_id = courseRows[0].course_creation_id;

        // Fetch topics and all videos with visit counts
        const [topics] = await db.query(
            `SELECT t.topic_id, t.topic_name, 
                    v.video_id, v.video_name, v.video_link,
                    COALESCE(vc.video_count, 0) AS visit_count
            FROM topics t
            LEFT JOIN videos v ON t.topic_id = v.topic_id
            LEFT JOIN video_count vc ON vc.video_id = v.video_id AND vc.user_id = ?
            WHERE t.subject_id IN (
                SELECT subject_id FROM course_subjects WHERE course_creation_id = ?
            )`, 
            [userId, courseCreationId]
        );

        // Organize topics and videos
        const topicsWithVideos = topics.reduce((acc, video) => {
            const { topic_id, topic_name, video_id, video_name, video_link, visit_count } = video;

            // Check if the topic already exists
            let existingTopic = acc.find(t => t.topic_id === topic_id);
            if (!existingTopic) {
                existingTopic = { 
                    topic_id, 
                    topic_name, 
                    videos: [] 
                };
                acc.push(existingTopic);
            }

            // Add the video to the topic
            if (video_id) {
                existingTopic.videos.push({ video_id, video_name, video_link, visit_count });
            }

            return acc;
        }, []);

        // Calculate visit percentage for each topic
        topicsWithVideos.forEach(topic => {
            const totalVideos = topic.videos.length;
            const visitedVideos = topic.videos.filter(video => video.visit_count > 0).length;
            topic.visitPercentage = totalVideos > 0 ? (visitedVideos / totalVideos) * 100 : 0;
        });

        res.json({ courseName, course_creation_id, topics: topicsWithVideos });
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Increment video count
router.post('/video/update_count', async (req, res) => {
    const { userId, courseCreationId, topicId, videoId } = req.body;

    if (!userId || !courseCreationId || !topicId || !videoId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Insert a new record or update the existing one
        await db.query(`
            INSERT INTO video_count (user_id, course_creation_id, topic_id, video_id, video_count)
            VALUES (?, ?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE video_count = video_count + 1`, 
            [userId, courseCreationId, topicId, videoId]
        );
       
        res.status(200).json({ message: 'Video count updated successfully' });
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update video count' });
    }
});





// Get video count for a specific user, course, and video
router.get('/video/count/:userId/:videoId', async (req, res) => {
    const { userId, videoId } = req.params;

    if (!userId || !videoId) {
        return res.status(400).json({ error: 'User ID and Video ID are required' });
    }

    try {
        const [result] = await db.query(`
            SELECT video_count FROM video_count 
            WHERE user_id = ? AND video_id = ?`, 
            [userId, videoId]
        );

        const videoCount = result.length > 0 ? result[0].video_count : 0;
        console.log(videoCount);
       
        res.status(200).json({ video_count: videoCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve video count' });
    }
});
// Get video count for a specific user, course, and video
router.get('/videovistedcount/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const [results] = await db.query(`
            SELECT 
                vc.course_creation_id, 
                cc.course_name, 
                COUNT(DISTINCT vc.video_id) AS viewed_video_count,
                (SELECT COUNT(DISTINCT v.video_id) 
                 FROM videos v 
                 JOIN course_subjects cs ON v.subject_id = cs.subject_id 
                 WHERE cs.course_creation_id = vc.course_creation_id) AS total_video_count
            FROM 
                video_count AS vc
            JOIN 
                course_creation AS cc ON vc.course_creation_id = cc.course_creation_id
            WHERE 
                vc.user_id = ?
            GROUP BY 
                vc.course_creation_id, cc.course_name
        `, [userId]);

        // Check if any courses were found
        if (results.length === 0) {
            return res.status(404).json({ message: 'No viewed courses found for this user.' });
        }

        // Calculate the percentage of viewed videos for each course
        const response = results.map(course => {
            const totalVideos = course.total_video_count || 0;
            const percentageViewed = totalVideos > 0 ? (course.viewed_video_count / totalVideos) * 100 : 0;

            return {
                course_creation_id: course.course_creation_id,
                course_name: course.course_name,
                viewed_video_count: course.viewed_video_count,
                total_video_count: totalVideos,
                percentage_viewed: percentageViewed.toFixed(2), // Fixed to 2 decimal places
            };
        });

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve viewed courses' });
    }
});

router.get('/courses_main', async (req, res) => {
    const userId = req.query.userId; // Get userId from query parameters
    try {
        const [rows] = await db.query(`
            SELECT
                c.course_creation_id,
                c.course_name,
                c.start_date,
                c.end_date,
                c.cost,
                c.discount,
                c.total_price,
                c.image,
                e.exam_name,
                GROUP_CONCAT(s.subject_name) AS subject_name,
                COUNT(DISTINCT v.video_id) AS video_count
            FROM
                course_creation c
            JOIN
                exams e ON c.exam_id = e.exam_id
            LEFT JOIN
                subjects s ON FIND_IN_SET(s.exam_id, c.exam_id)
            
                 LEFT JOIN
        course_subjects cs ON c.course_creation_id = cs.course_creation_id
         LEFT JOIN
        videos v ON v.subject_id = cs.subject_id
            LEFT JOIN
                buycourse b ON b.course_creation_id = c.course_creation_id AND b.user_id = ?
            WHERE
                b.course_creation_id IS NULL
            GROUP BY
                c.course_creation_id;
        `, [userId]);
 
        if (rows.length > 0) {
            const coursesWithImages = rows.map(course => {
                if (course.image) {
                    course.image = Buffer.from(course.image).toString('base64');
                }
                return course;
            });
 
            res.json(coursesWithImages);
        } else {
            res.status(404).json({ message: 'No courses found' });
        }
       
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).send('Internal Server Error');
    }
});
 
 
 
router.post('/buy_course', async (req, res) => {
    const { userId, courseCreationId, paymentId, status } = req.body;
 
    // Validate required fields
    if (!userId || !courseCreationId || !paymentId || !status) {
        return res.status(400).json({ message: 'User ID, Course Creation ID, Payment ID, and Status are required.' });
    }
 
    if (status !== 'paid') {
        return res.status(400).json({ message: 'Payment was not successful. No course purchased.' });
    }
 
    // Insert the course purchase
    try {
        const result = await db.query(`INSERT INTO buycourse (user_id, course_creation_id, payment_id, paymentstatus, activation) VALUES (?, ?, ?, ?, ?)`, [userId, courseCreationId, paymentId, status, 1]);
        const redirectUrl = `/MyCourses/${userId}`;
        return res.status(201).json({ message: 'Course purchased successfully.', courseId: result.insertId , redirectUrl});
    } catch (error) {
        console.error('Error purchasing course:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
 
 
 
const razorpay = new Razorpay({
    key_id: 'rzp_test_x3lel82AZIsRl6', // Replace with your Razorpay key ID
    key_secret: 'IAdwmjeqwMbXm9LEJD90JtAk' // Replace with your Razorpay key secret
});
 
// Create a route to create an order
router.post('/create-order', async (req, res) => {
    console.log('Create order request received:', req.body);
    const { amount } = req.body;
 
    // Additional logging
    console.log('Amount:', amount);
 
    const options = {
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${new Date().getTime()}`,
    };
 
    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Error creating order:', error); // Log the error
        res.status(500).send('Server error');
    }
});
 
module.exports = router;
 
 
 