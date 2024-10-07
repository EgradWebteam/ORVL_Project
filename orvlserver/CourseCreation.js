const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require("./database");
const fs = require('fs');



// Ensure this points to your database connection
 
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });

router.get('/course-list', async (req, res) => {
    const query = `
    SELECT 
        c.course_creation_id,
        e.exam_id, 
        e.exam_name,  
        c.course_name,
        GROUP_CONCAT(DISTINCT s.subject_name SEPARATOR ', ') AS subjects, -- Concatenate subject names
        c.start_date,
        c.end_date,
        c.cost,
        c.discount,
        (c.cost * (c.discount / 100)) AS discount_amount,
        c.total_price,
        c.image
    FROM
        course_creation c
    JOIN
        exams e ON c.exam_id = e.exam_id
    JOIN
        subjects s ON FIND_IN_SET(s.subject_id, c.subject_id) -- Adjust based on how subjects are stored
    GROUP BY 
        e.exam_id;
    `;
   
    try {
        const [results] = await db.query(query); // Change from pool to db
        res.json(results);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).send('Error fetching courses');
    }
});

 // POST API for course creation
// POST API for course creation
router.post('/create-course', upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
    const { exam_id, subject_ids, course_name, start_date, end_date, cost, discount } = req.body;

    const image = req.files['image'] && req.files['image'][0] ? req.files['image'][0].path : null;
    let imageBuffer = null;
    if (image) {
        imageBuffer = fs.readFileSync(image);
    }
    
    const discount_amount = cost * (discount / 100 || 0);
    const total_price = cost - discount_amount;

    // Validate required fields
    if (!exam_id || !subject_ids || !course_name || !start_date || !end_date || !cost || !discount) {
        return res.status(400).send('All fields are required');
    }

    const subjectIdsArray = Array.isArray(subject_ids) ? subject_ids : [subject_ids];

    const query = `INSERT INTO course_creation (exam_id, subject_id, course_name, start_date, end_date, cost, discount, discount_amount, total_price, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        for (const subject_id of subjectIdsArray) {
            // Save image as a blob in the database
            await db.query(query, [exam_id, subject_id, course_name, start_date, end_date, cost, discount, discount_amount, total_price, imageBuffer]);
        }
        res.status(201).send('Course created successfully for all selected subjects');
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).send('Error creating course: ' + error.message);
    }
});


 // PUT API for course creation
router.put('/update-course/:id', upload.single('image'), async (req, res) => {
    const courseId = req.params.id; // This is expected to be the course_creation_id
    const { exam_id, subject_ids, course_name, start_date, end_date, cost, discount } = req.body;

    // Ensure subject_ids is an array
    const subjectIdsArray = Array.isArray(subject_ids) ? subject_ids : [subject_ids];
    const subjectIdsString = subjectIdsArray.join(',');

    // Calculate discount and total price
    const discount_amount = cost * (discount / 100 || 0);
    const total_price = cost - discount_amount;

    // Validation
    if (!exam_id || !subjectIdsString || !course_name || !start_date || !end_date || !cost || isNaN(cost) || isNaN(discount)) {
        return res.status(400).send('All fields are required and must be valid');
    }

    // Update the query with the correct primary key column name
    const query = `UPDATE course_creation SET exam_id = ?, subject_id = ?, course_name = ?, start_date = ?, end_date = ?, cost = ?, discount = ?, discount_amount = ?, total_price = ? WHERE course_creation_id = ?`;

    try {
        await db.query(query, [exam_id, subjectIdsString, course_name, start_date, end_date, cost, discount, discount_amount, total_price, courseId]); // Changed to db
        res.status(200).send('Course updated successfully');
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).send('Error updating course: ' + error.message);
    }
});

// DELETE api for deleting a course
router.delete('/delete-course/:id', async (req, res) => {
    const courseId = req.params.id;

    const query = 'DELETE FROM course_creation WHERE course_creation_id = ?'; // Ensure the correct column is used

    try {
        const [result] = await db.query(query, [courseId]); // Changed to db
        if (result.affectedRows === 0) {
            return res.status(404).send('Course not found');
        }
        res.status(200).send('Course deleted successfully');
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send('Error deleting course: ' + error.message);
    }
});


// Export the router
module.exports = router;
