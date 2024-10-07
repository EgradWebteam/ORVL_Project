import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CourseCreationForm.css';
import Leftnavbar from './Leftnavbar';
const CourseCreationForm = () => {
    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [courseData, setCourseData] = useState({
        exam_id: '',
        subject_ids: [],
        course_name: '',
        start_date: '',
        end_date: '',
        cost: '',
        discount: '',
        discount_amount: '',
        image: null,
    });
    
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:8000/CourseCreation/course-list');
            console.log("Fetched courses:", response.data); // Log fetched data
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };
    const fetchExams = async () => {
        try {
            const response = await axios.get('http://localhost:8000/ExamCreation/exams');
            setExams(response.data);
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchExams();
    }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            if (courseData.exam_id) {
                try {
                    const response = await axios.get(`http://localhost:8000/ExamCreation/exam/${courseData.exam_id}/subjects`);
                    setSubjects(response.data);
                } catch (error) {
                    console.error('Error fetching subjects:', error);
                }
            } else {
                setSubjects([]);
            }
        };

        fetchSubjects();
    }, [courseData.exam_id]);
    useEffect(() => {
        console.log("Editing Course ID:", editingCourseId); // Log to see if it changes
    }, [editingCourseId]);
    
    const handleCourseChange = ({ target: { name, value } }) => {
        if ((name === 'cost' || name === 'discount') && isNaN(value)) {
            return; // Prevent invalid input
        }
        setCourseData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setCourseData((prev) => ({ ...prev, image: e.target.files[0] }));
    };
// Handle Subject Change
const handleSubjectChange = (subject_id) => {
    setCourseData((prev) => {
        const { subject_ids } = prev;
        if (subject_ids.includes(subject_id)) {
            return { ...prev, subject_ids: subject_ids.filter(id => id !== subject_id) };
        } else {
            return { ...prev, subject_ids: [...subject_ids, subject_id] };
        }
    });
};

    const calculateDiscountAmount = () => {
        const { cost, discount } = courseData;
        return cost ? (cost * (discount / 100)).toFixed(2) : '';
    };

    const calculateTotalPrice = () => {
        const { cost } = courseData;
        const discountAmount = calculateDiscountAmount();
        return cost ? (cost - discountAmount).toFixed(2) : '';
    };

    const handleCreateCourseSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        const formData = new FormData();
        for (const key in courseData) {
            if (key === "subject_ids") {
                courseData.subject_ids.forEach((id) => {
                    formData.append('subject_ids', id);
                });
            } else {
                formData.append(key, courseData[key]);
            }
        }
    
        try {
            const url = 'http://localhost:8000/CourseCreation/create-course';
            await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            alert('Course created successfully');
            fetchCourses();
            resetForm();
        } catch (error) {
            setError('Error saving course: ' + (error.response ? error.response.data : error.message));
            console.error('Error saving course:', error);
        }
    };

    const handleEditCourseSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        const formData = new FormData();
        for (const key in courseData) {
            if (key === "subject_ids") {
                courseData.subject_ids.forEach((id) => {
                    formData.append('subject_ids', id);
                });
            } else {
                formData.append(key, courseData[key]);
            }
        }
    
        try {
            const url = `http://localhost:8000/CourseCreation/update-course/${editingCourseId}`;
            await axios.put(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            alert('Course updated successfully');
            fetchCourses();
            resetForm();
        } catch (error) {
            setError('Error saving course: ' + (error.response ? error.response.data : error.message));
            console.error('Error saving course:', error);
        }
    };

    const resetForm = () => {
        setCourseData({
            exam_id: '',
            subject_ids: [],
            course_name: '',
            start_date: '',
            end_date: '',
            cost: '',
            discount: '',
            discount_amount: '0.00',
            image: null,
        });
        setEditingCourseId(null);
        setModalOpen(false);
        setSubjects([]); // Reset subjects as well if needed
    };
    const handleEdit = (course) => {
        console.log("Editing course object:", course); // Check the course object
        if (course && course.course_creation_id) {
            setCourseData({
                exam_id: course.exam_id,
                subject_ids: course.subject_ids ? course.subject_ids.split(',') : [],
                course_name: course.course_name,
                start_date: course.start_date,
                end_date: course.end_date,
                cost: Math.floor(course.cost),
                discount: Math.floor(course.discount),
                image: null,
            });
            setEditingCourseId(course.course_creation_id); // Set the editing ID
            setModalOpen(true); // Open the modal for editing
        } else {
            console.error("Invalid course object or missing course_creation_id");
        }
    };
    
    
    
    const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    console.log("Deleting course with ID:", courseId); // Log the course ID

    try {
        await axios.delete(`http://localhost:8000/CourseCreation/delete-course/${courseId}`);
        alert('Course deleted successfully');
        fetchCourses(); // Refresh the course list
    } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course: ' + (error.response ? error.response.data : error.message));
    }
};

    return (
        <div>
            
            <h1>Course Creation Form</h1>
            <button className="add-button" onClick={() => setModalOpen(true)}>Add New Course</button>

            {error && <p className="error-message">{error}</p>}
            {modalOpen && (
    <div className='modal'>
        <div className='modal-content'>
            <h2>{editingCourseId ? 'Edit Course' : 'Create Course'}</h2>
            {editingCourseId ? (
                <EditCourseForm 
                    courseData={courseData} 
                    handleCourseChange={handleCourseChange} 
                    handleSubjectChange={handleSubjectChange} 
                    handleImageChange={handleImageChange} 
                    resetForm={resetForm} 
                    handleSubmit={handleEditCourseSubmit} 
                    calculateTotalPrice={calculateTotalPrice} 
                    calculateDiscountAmount={calculateDiscountAmount} 
                    exams={exams} 
                    subjects={subjects}
                />
            ) : (
                <CreateCourseForm 
                    courseData={courseData} 
                    handleCourseChange={handleCourseChange} 
                    handleSubjectChange={handleSubjectChange} 
                    handleImageChange={handleImageChange} 
                    resetForm={resetForm} 
                    handleSubmit={handleCreateCourseSubmit} 
                    calculateTotalPrice={calculateTotalPrice} 
                    calculateDiscountAmount={calculateDiscountAmount} 
                    exams={exams} 
                    subjects={subjects}
                />
            )}
        </div>
    </div>
)}

            <h2>Course List</h2>
            <table>
                <thead>
                    <tr>
                        <th>S.No.</th>
                        <th>Exam Name</th>
                        <th>Subject Names</th>
                        <th>Course Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Cost</th>
                        <th>Discount</th>
                        <th>Total Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {courses.map((course, index) => (
    <tr key={course.exam_id_id}> {/* Ensure this ID is correct */}
        <td>{index + 1}</td>
        <td>{course.exam_name}</td>
        <td>{course.subjects}</td>
        <td>{course.course_name}</td>
        <td>{course.start_date}</td>
        <td>{course.end_date}</td>
        <td>₹{course.cost}</td>
        <td>{course.discount}%</td>
        <td>₹{course.total_price}</td>
        <td>
            <button onClick={() => {
                console.log("Course to edit:", course); // Log before editing
                handleEdit(course);
            }}>
                Edit
            </button>
            <button onClick={() => handleDelete(course.course_creation_id)}>Delete</button>
        </td>
    </tr>
))}

                </tbody>
            </table>
        </div>
    );
};

const CreateCourseForm = ({ courseData, handleCourseChange, handleSubjectChange, handleImageChange, resetForm, handleSubmit, calculateTotalPrice, calculateDiscountAmount, exams, subjects }) => {
    return (
        <form onSubmit={handleSubmit}>
            <select
                name="exam_id"
                value={courseData.exam_id}
                onChange={handleCourseChange}
                required
            >
                <option value="">--Select Exam--</option>
                {exams.map((exam) => (
                    <option key={exam.exam_id} value={exam.exam_id}>
                        {exam.exam_name}
                    </option>
                ))}
            </select>

            <div>
                <h4>Select Subjects:</h4>
                {subjects.map((subject) => (
                    <label key={subject.subject_id}>
                        <input
                            type="checkbox"
                            checked={courseData.subject_ids.includes(subject.subject_id)}
                            onChange={() => handleSubjectChange(subject.subject_id)}
                        />
                        {subject.subject_name}
                    </label>
                ))}
            </div>

            <input
                type="text"
                name="course_name"
                placeholder="Course Name"
                value={courseData.course_name}
                onChange={handleCourseChange}
                required
            />
            <input
                type="date"
                name="start_date"
                value={courseData.start_date}
                onChange={handleCourseChange}
                required
            />
            <input
                type="date"
                name="end_date"
                value={courseData.end_date}
                onChange={handleCourseChange}
                required
            />
            <input
                type="number"
                name="cost"
                placeholder="Cost"
                value={courseData.cost}
                onChange={handleCourseChange}
                required
            />
            <input
                type="number"
                name="discount"
                placeholder="Discount (%)"
                value={courseData.discount}
                onChange={handleCourseChange}
            />
            <p>Total Price: ₹{calculateTotalPrice()}</p>
            <input
                type="number"
                name="discount_amount"
                placeholder="Discount Amount"
                value={calculateDiscountAmount()}
                onChange={handleCourseChange}
            />
            <label htmlFor="image">Upload Course Image:</label>
            <input
                id="image"
                type="file"
                name="image"
                onChange={handleImageChange}
                required
            />
            <button type="submit">Create Course</button>
            <button type="button" onClick={resetForm}>Cancel</button>
        </form>
    );
};

const EditCourseForm = ({ courseData, handleCourseChange, handleSubjectChange, handleImageChange, resetForm, handleSubmit, calculateTotalPrice, calculateDiscountAmount, exams, subjects }) => {
    return (
        <form onSubmit={handleSubmit}>
            <select
                name="exam_id"
                value={courseData.exam_id}
                onChange={handleCourseChange}
                required
            >
                <option value="">--Select Exam--</option>
                {exams.map((exam) => (
                    <option key={exam.exam_id} value={exam.exam_id}>
                        {exam.exam_name}
                    </option>
                ))}
            </select>

            <div>
                <h4>Select Subjects:</h4>
                {subjects.map((subject) => (
                    <label key={subject.subject_id}>
                        <input
                            type="checkbox"
                            checked={courseData.subject_ids.includes(subject.subject_id)}
                            onChange={() => handleSubjectChange(subject.subject_id)}
                        />
                        {subject.subject_name}
                    </label>
                ))}
            </div>

            <input
                type="text"
                name="course_name"
                placeholder="Course Name"
                value={courseData.course_name}
                onChange={handleCourseChange}
                required
            />
            <input
                type="date"
                name="start_date"
                value={courseData.start_date}
                onChange={handleCourseChange}
                required
            />
            <input
                type="date"
                name="end_date"
                value={courseData.end_date}
                onChange={handleCourseChange}
                required
            />
            <input
                type="number"
                name="cost"
                placeholder="Cost"
                value={courseData.cost}
                onChange={handleCourseChange}
                required
            />
            <input
                type="number"
                name="discount"
                placeholder="Discount (%)"
                value={courseData.discount}
                onChange={handleCourseChange}
            />
            <p>Total Price: ₹{calculateTotalPrice()}</p>
            <input
                type="number"
                name="discount_amount"
                placeholder="Discount Amount"
                value={calculateDiscountAmount()}
                onChange={handleCourseChange}
            />
            <label htmlFor="image">Upload Course Image:</label>
            <input
                id="image"
                type="file"
                name="image"
                onChange={handleImageChange}
                required={!courseData.image}
            />
            <button type="submit">UPDATE </button>
            <button type="button" onClick={resetForm}>Cancel</button>
        </form>
    );
};

export default CourseCreationForm;
