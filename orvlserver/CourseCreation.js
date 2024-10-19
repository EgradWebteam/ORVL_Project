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
 
// GET API to fetch course details by course_creation_id
router.get('/course-list', async (req, res) => {
    const query = `
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
        c.payment_link,
        c.image,
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
    GROUP BY
        c.course_creation_id;
    `;
    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).send('Error fetching courses');
    }
});
 
 
// POST API for course creation
router.post('/create-course', upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
    const { exam_id, subject_ids, course_name, start_date, end_date, cost, discount, payment_link} = req.body;
 
    const image = req.files['image'] && req.files['image'][0] ? req.files['image'][0].path : null;
    let imageBuffer = null;
    if (image) {
        imageBuffer = fs.readFileSync(image);
    }
   
    // Calculate discount and total price
    const discount_amount = cost * (discount / 100 || 0);
    const total_price = cost - discount_amount;
 
    // Validate required fields
    if (!exam_id || !subject_ids || !course_name || !start_date || !end_date || !cost || !discount||!payment_link) {
        return res.status(400).send('All fields are required');
    }
 
    const subjectIdsArray = Array.isArray(subject_ids) ? subject_ids : [subject_ids];
 
    // Insert into course_creation table
    const courseQuery = `
        INSERT INTO course_creation (exam_id, course_name, start_date, end_date, cost, discount, discount_amount, total_price,payment_link, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
   
    try {
        const [courseResult] = await db.query(courseQuery, [exam_id, course_name, start_date, end_date, cost, discount, discount_amount, total_price,payment_link, imageBuffer]);
 
        // Insert into course_subjects table
        const courseCreationId = courseResult.insertId; // Get the ID of the newly created course
        const subjectsData = subjectIdsArray.map(subject_id => [courseCreationId, subject_id]);
 
        const subjectQuery = `INSERT INTO course_subjects (course_creation_id, subject_id) VALUES ?`;
        await db.query(subjectQuery, [subjectsData]);
 
        res.status(201).send('Course created successfully');
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).send('Error creating course: ' + error.message);
    }
});
 
// PUT API for course update
router.put('/update-course/:id', upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
    const courseId = req.params.id;
    const { exam_id, subject_ids, course_name, start_date, end_date, cost, discount,payment_link } = req.body;
 
    const image = req.files['image'] && req.files['image'][0] ? req.files['image'][0].path : null;
    let imageBuffer = null;
    if (image) {
        imageBuffer = fs.readFileSync(image);
    }
   
    const discount_amount = cost * (discount / 100 || 0);
    const total_price = cost - discount_amount;
 
    // Validation
    if (!exam_id || !subject_ids || !course_name || !start_date || !end_date || !cost ||!payment_link|| isNaN(cost) || isNaN(discount)) {
        return res.status(400).send('All fields are required and must be valid');
    }
 
    // Update the course_creation table
    const courseQuery = `UPDATE course_creation SET exam_id = ?, course_name = ?, start_date = ?, end_date = ?, cost = ?, discount = ?, discount_amount = ?, total_price = ?,payment_link=?, image = ? WHERE course_creation_id = ?`;
   
    try {
        await db.query(courseQuery, [exam_id, course_name, start_date, end_date, cost, discount, discount_amount, total_price, image,payment_link, courseId]);
 
        // Update course_subjects table
        const subjectIdsArray = Array.isArray(subject_ids) ? subject_ids : [subject_ids];
 
        // Clear existing subjects
        await db.query(`DELETE FROM course_subjects WHERE course_creation_id = ?`, [courseId]);
 
        // Insert new subjects
        const subjectsData = subjectIdsArray.map(subject_id => [courseId, subject_id]);
        const subjectQuery = `INSERT INTO course_subjects (course_creation_id, subject_id) VALUES ?`;
        await db.query(subjectQuery, [subjectsData]);
 
        res.status(200).send('Course updated successfully');
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).send('Error updating course: ' + error.message);
    }
});
 
// DELETE API for deleting a course
router.delete('/delete-course/:id', async (req, res) => {
    const courseId = req.params.id;
 
    try {
        // First delete from course_subjects
        await db.query('DELETE FROM course_subjects WHERE course_creation_id = ?', [courseId]);
       
        // Then delete from course_creation
        const query = 'DELETE FROM course_creation WHERE course_creation_id = ?';
        const [result] = await db.query(query, [courseId]);
       
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
 