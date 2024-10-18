import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Leftnavbar from './Leftnavbar';
import { IoMdHome } from "react-icons/io";
import Logo_img from '../Images/image.png';
import './CourseCreationForm.css';
 
const CourseCreationForm = () => {
    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [courseData, setCourseData] = useState({
        exam_id: '',
        subject_ids: [],
        course_name: '',
        start_date: '',
        end_date: '',
        cost: '',
        discount: '',
        image: null,
    });
   
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
 
    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:8000/CourseCreation/course-list');
            setCourses(response.data);
            console.log('Fetched Courses:', response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };
   
    const fetchExams = async () => {
        try {
            const response = await axios.get('http://localhost:8000/ExamCreation/exams');
            setExams(response.data);
            console.log('Fetched Exams:', response.data);
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    };
 
    useEffect(() => {
        fetchCourses();
        fetchExams();
    }, []);
 
    const fetchSubjects = async (examId) => {
        console.log('Fetching subjects for exam ID:', examId);
        if (examId) {
            try {
                const response = await axios.get(`http://localhost:8000/ExamCreation/exam/${examId}/subjects`);
                setSubjects(response.data);
                console.log('Fetched Subjects:', response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        } else {
            setSubjects([]);
        }
    };
 
    useEffect(() => {
        fetchSubjects(courseData.exam_id);
    }, [courseData.exam_id]);
 
    const handleCourseSelect = (courseId) => {
        console.log('Course selected:', courseId);
        setSelectedCourseId(courseId);
        fetchCourseDetails(courseId);
    };
   
    const fetchCourseDetails = async (courseId) => {
        try {
            const response = await axios.get(`http://localhost:8000/CourseCreation/course-list/${courseId}`);
            console.log('Fetched Course Details:', response.data);
            setCourseData({
                exam_id: response.data.exam_id,
                subject_ids: response.data.subject_ids.split(',').map(id => id.trim()),
                course_name: response.data.course_name,
                start_date: response.data.start_date,
                end_date: response.data.end_date,
                cost: response.data.cost,
                discount: response.data.discount,
                image: null,
            });
            setEditingCourseId(courseId);
            setModalOpen(true);
        } catch (error) {
            console.error('Error fetching course details:', error);
        }
    };
   
    const handleCourseChange = ({ target: { name, value } }) => {
        console.log(`Course data changed: ${name} = ${value}`);
        if ((name === 'cost' || name === 'discount') && isNaN(value)) {
            return;
        }
        setCourseData((prev) => ({ ...prev, [name]: value }));
    };
 
    const handleImageChange = (e) => {
        console.log('Image selected:', e.target.files[0]);
        setCourseData((prev) => ({ ...prev, image: e.target.files[0] }));
    };
 
    const handleSubjectChange = (subject_id) => {
        console.log('Subject toggled:', subject_id);
        setCourseData((prev) => {
            const { subject_ids } = prev;
            if (subject_ids.includes(String(subject_id))) {
                return { ...prev, subject_ids: subject_ids.filter(id => id !== String(subject_id)) };
            } else {
                return { ...prev, subject_ids: [...subject_ids, String(subject_id)] };
            }
        });
    };
   
    const calculateDiscountAmount = () => {
        const { cost, discount } = courseData;
        const discountAmount = cost ? (cost * (discount / 100)).toFixed(2) : '0.00';
        console.log('Calculated Discount Amount:', discountAmount);
        return discountAmount;
    };
 
    const calculateTotalPrice = () => {
        const { cost } = courseData;
        const discountAmount = calculateDiscountAmount();
        const totalPrice = cost ? (cost - discountAmount).toFixed(2) : '0.00';
        console.log('Calculated Total Price:', totalPrice);
        return totalPrice;
    };
 
    const handleCourseSubmit = async (e) => {
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
            const url = editingCourseId
                ? `http://localhost:8000/CourseCreation/update-course/${editingCourseId}`
                : 'http://localhost:8000/CourseCreation/create-course';
   
            console.log('Submitting Course Data:', Array.from(formData.entries()));
   
            const response = editingCourseId
                ? await axios.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                : await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
   
            alert(`Course ${editingCourseId ? 'updated' : 'created'} successfully`);
            fetchCourses();
            resetForm();
        } catch (error) {
            setError('Error saving course: ' + (error.response ? error.response.data : error.message));
            console.error('Error saving course:', error);
        }
    };
   
    const resetForm = () => {
        console.log('Resetting form data');
        setCourseData({
            exam_id: '',
            subject_ids: [],
            course_name: '',
            start_date: '',
            end_date: '',
            cost: '',
            discount: '',
            image: null,
        });
        setEditingCourseId(null);
        setModalOpen(false);
    };
 
    const handleEdit = async (course) => {
        console.log('Editing course:', course);
        setCourseData({
            exam_id: course.exam_id,
            subject_ids: course.subject_ids.split(',').map(id => id.trim()),
            course_name: course.course_name,
            start_date: course.start_date,
            end_date: course.end_date,
            cost: Math.floor(course.cost),
            discount: Math.floor(course.discount),
            image: null,
        });
   
        setEditingCourseId(course.course_creation_id);
        setModalOpen(true);
        await fetchSubjects(course.exam_id);
    };
   
    const handleDelete = async (courseId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;
 
        try {
            await axios.delete(`http://localhost:8000/CourseCreation/delete-course/${courseId}`);
            alert('Course deleted successfully');
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Error deleting course: ' + (error.response ? error.response.data : error.message));
        }
    };
 
    return (
        <div>
      <div className='headerjeem'>
        <div className='headerjee'>
          <img src={Logo_img} alt="Logo" />
        </div>
        <a className='jeeanchor' href='/Home'>
          <IoMdHome /> Home
        </a>
      </div>
      <Leftnavbar />
      <div className='headerpageh1'>
        <h1> Course Creation Page</h1>
      </div>
        <div className="course-creation-container">
            
            <button className="btnes1" onClick={() => setModalOpen(true)}>Add New Course</button>
 
            {error && <p className="error-message">{error}</p>}
 
            {modalOpen && (
                <div className='modal'>
                    <div className='modal-content'>
                     
                        <h2>{editingCourseId ? 'Edit Course' : 'Create Course'}</h2>
                        <form onSubmit={handleCourseSubmit}>
                        <div className='group1'>
    <div className="label">
        <span>Course Name:</span>
        <input
            type="text"
            name="course_name"
            placeholder="Course Name"
            value={courseData.course_name}
            onChange={handleCourseChange}
            required
        />
    </div>
    <div className="label">
        <span>Select Exam:</span>
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
    </div>
</div>

                            <div>

                                <h4>Select Subjects:</h4>
                                {subjects.map((subject) => (
                                    <label key={subject.subject_id}>
                                        <input
                                            type="checkbox"
                                            checked={courseData.subject_ids.includes(String(subject.subject_id))}
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
                                readOnly
                            />
                            <label htmlFor="image">Upload Course Image:</label>
                            <input
                                id="image"
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                required={!editingCourseId}
                            />
 
                            <button type="submit">{editingCourseId ? 'Update Course' : 'Create Course'}</button>
                            <button type="button" onClick={resetForm}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
 
 <div className='course-list-container'>
    <h1>Course List</h1>
    <table className='course-list-table'>
        <thead>
            <tr>
                <th>S.no</th>
                <th>Exam Name</th>
                <th>Course Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Cost</th>
                <th>Discount (%)</th>
                <th>Discount Amount</th>
                <th>Total Price</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {courses.map((course, index) => (
                <tr key={course.course_creation_id}>
                    <td>{index + 1}</td>
                    <td>{course.exam_name}</td>
                    <td>{course.course_name}</td>
                    <td>{course.start_date}</td>
                    <td>{course.end_date}</td>
                    <td>{course.cost}</td>
                    <td>{course.discount}</td>
                    <td>{course.discount_amount}</td>
                    <td>
                        {(course.cost - (course.cost * (course.discount / 100))).toFixed(2)}
                    </td>
                    <td className='upddel'>
                        <button className="update" onClick={() => handleEdit(course)}>Update</button>
                        <button className="delete" onClick={() => handleDelete(course.course_creation_id)}>Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
 </div>
        </div>
    );
};
 
export default CourseCreationForm;
 
 
 