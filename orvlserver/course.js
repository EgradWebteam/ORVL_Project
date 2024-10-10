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
// Get course details, topics, and videos by userId and courseCreationId
router.get('/my_courses/course_details/:userId/:courseCreationId', async (req, res) => {
    const { userId, courseCreationId } = req.params;

    try {
        // Fetch course name
        const [courseRows] = await db.query(`
            SELECT course_name
            FROM course_creation
            WHERE course_creation_id = ?
        `, [courseCreationId]);

        if (courseRows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const courseName = courseRows[0].course_name;

        // Fetch topics and videos for the specified course
        const [topics] = await db.query(`
            SELECT t.topic_id, t.topic_name,
                   v.video_name, v.video_link
            FROM topics t
            LEFT JOIN videos v ON t.topic_id = v.topic_id
            WHERE t.subject_id IN (
                SELECT subject_id FROM course_subjects WHERE course_creation_id = ?
            )
        `, [courseCreationId]);

        // Organize topics and videos
        const topicsWithVideos = topics.reduce((acc, topic) => {
            const { topic_id, topic_name, video_name, video_link } = topic;

            // Check if the topic already exists
            let existingTopic = acc.find(t => t.topic_id === topic_id);
            if (!existingTopic) {
                existingTopic = { topic_id, topic_name, videos: [] };
                acc.push(existingTopic);
            }

            // Add the video if it exists
            if (video_name && video_link) {
                existingTopic.videos.push({ video_name, video_link });
            }

            return acc;
        }, []);

        res.json({ courseName, topics: topicsWithVideos });
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).send('Internal Server Error');
    }
});

// router.get('/courses_main', async (req, res) => {
//     try {
//         const [rows] = await db.query(`
//             SELECT
//                 c.course_creation_id,
//                 c.course_name,
//                 c.start_date,
//                 c.end_date,
//                 c.cost,
//                 c.discount,
//                 c.total_price,
//                 c.image,
//                 e.exam_name,
//                 GROUP_CONCAT(s.subject_name) AS subject_name,
//                 (SELECT COUNT(*) FROM videos v WHERE FIND_IN_SET(v.subject_id, c.subject_id)) AS video_count
//             FROM
//                 course_creation c
//             JOIN
//                 exams e ON c.exam_id = e.exam_id
//             LEFT JOIN
//                 subjects s ON FIND_IN_SET(s.exam_id, c.exam_id)
//             GROUP BY
//                 c.course_creation_id;
//         `);
 
//         if (rows.length > 0) {
//             // Convert BLOB to Base64 string for each course
//             const coursesWithImages = rows.map(course => {
//                 if (course.image) {
//                     course.image = Buffer.from(course.image).toString('base64');
//                 }
//                 return course;
//             });
 
//             res.json(coursesWithImages);
//         } else {
//             res.status(404).json({ message: 'No courses found' });
//         }
       
//     } catch (error) {
//         console.error('Error fetching course details:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });
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
 
        return res.status(201).json({ message: 'Course purchased successfully.', courseId: result.insertId });
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
 
 
 