import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

function InstructorDashboard() {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        axios.get('/courses').then(res => {
            const instructorCourses = res.data.filter(course => course.instructor && course.instructor._id === userId);
            setCourses(instructorCourses);
        })
            .catch(() => setError("Failed to load Courses"));
    }, []);

    const handleDelete = async (courseId) => {
        try{
            const token = localStorage.getItem('token');
            await axios.delete(`/courses/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(courses.filter(course => course._id !== courseId));
        }catch(error){
            setError("Failed to delete course");
        }
    }

    return (
        <div>
            <h2>
                Welcome to Instructor DashBoard
            </h2>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <ul>
                {courses.map(course=>(
                    <li key={course._id}>
                        <strong>{course.title}</strong>-{}{course.description}
                        <button onClick={() => handleDelete(course._id)} style={{ marginLeft: 10 }}>
                            Delete </button>
                        <Link to={`/courses/${course._id}/lessons`} style={{ marginLeft: 10 }}>
                        View/Edit Lessons
                        </Link>
                    </li>
                ))}
            </ul>
            {courses.length === 0 && <div>No courses found</div>}
        </div>

    )
}

export default InstructorDashboard;