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
    const query = `
        SELECT e.exam_name,
               e.image,
               e.exam_id,
               GROUP_CONCAT(DISTINCT s.subject_name SEPARATOR ', ') AS subjects,
               COUNT(DISTINCT s.subject_id) AS subject_count,
               COUNT(v.video_id) AS number_of_videos,
               MAX(cc.end_date) AS validity,
               cc.course_name,
               MAX(cc.total_price) AS total_price
        FROM exams e
        LEFT JOIN subjects s ON e.exam_id = s.exam_id
        LEFT JOIN videos v ON e.exam_id = v.exam_id
        LEFT JOIN course_creation cc ON e.exam_id = cc.exam_id
        GROUP BY e.exam_id
    `;

    try {
        // Execute the query using the db object
        const [results] = await db.query(query);

        // Send the results as JSON
        res.json(results);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Server error');
    }
});

// router.get('/courses_main/:userId', async (req, res) => {
//     const userId = req.params.userId;

//     try {
//         const courses = await db.query(`
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
//             WHERE 
//                 NOT EXISTS (
//                     SELECT 1 
//                     FROM buycourse b 
//                     WHERE b.user_id = ? AND b.course_creation_id = c.course_creation_id
//                 )
//             GROUP BY 
//                 c.course_creation_id;
//         `, [userId]);

//         // Process the courses for response
//         const processedCourses = courses.map(course => {
//             if (course.image) {
//                 course.image = Buffer.from(course.image).toString('base64');
//             }
//             return course;
//         });

//         if (processedCourses.length > 0) {
//             res.json(processedCourses);
//         } else {
//             res.status(404).json({ message: 'No available courses found' });
//         }

//     } catch (error) {
//         console.error('Error fetching course details:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

router.post('/buy_course', async (req, res) => {
    const { userId, courseCreationId } = req.body;

    if (!userId || !courseCreationId) {
        return res.status(400).json({ message: 'User ID and Course Creation ID are required.' });
    }

    try {
        const result = await db.query(`
            INSERT INTO buycourse (user_id, course_creation_id, activation) 
            VALUES (?, ?, 0)`, [userId, courseCreationId]);

        if (result.affectedRows > 0) {
            return res.status(201).json({ message: 'Course purchased successfully.' });
        } else {
            return res.status(500).json({ message: 'Failed to purchase course.' });
        }
    } catch (error) {
        console.error('Error purchasing course:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/courses_main', async (req, res) => {
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
                (SELECT COUNT(*) FROM videos v WHERE FIND_IN_SET(v.subject_id, c.subject_id)) AS video_count 
            FROM 
                course_creation c 
            JOIN 
                exams e ON c.exam_id = e.exam_id 
            LEFT JOIN 
                subjects s ON FIND_IN_SET(s.exam_id, c.exam_id) 
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

    try {
        // Insert the course purchase
        const result = await db.query(`
            INSERT INTO buycourse (user_id, course_creation_id, payment_id, paymentstatus, activation) 
            VALUES (?, ?, ?, ?, ?)`, [userId, courseCreationId, paymentId, status, 1]);

        // Check if the insertion was successful by looking at the last inserted ID
        if (status==='paid') {
            return res.status(201).json({ message: 'Course purchased successfully.', courseId: result.insertId });
        } else {
            return res.status(400).json({ message: 'Failed to purchase course. No record inserted.' });
        }
    } catch (error) {
        console.error('Error purchasing course:', error); // Log the specific error
        return res.status(500).json({ message: 'Internal Server Error', error: error.message }); // Return a more detailed error
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
