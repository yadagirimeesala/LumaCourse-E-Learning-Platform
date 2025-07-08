import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

function StudentDashboard() {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get('/courses/my-courses', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => setEnrolledCourses(res.data.enrolledCourses))
            .catch(() => setError("Failed to load enrolled courses"));
    }, [])

    return (
        <div>
            <h2>
                Welcome to Student DashBoard
            </h2>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <h3>Your Enrolled Courses:</h3>
            <ul>
                {enrolledCourses.length === 0 && <li>No courses enrolled</li>}
                {enrolledCourses.map(course => (
                    <li key={course._id}>
                        <strong>{course.title}</strong> - {course.description} 
                        <Link to={`/courses/${course._id}/lessons`} style={{marginLeft:10}}>View Course</Link>                   
                    </li>
                ))

                }
            </ul>
        </div>
    )
}

export default StudentDashboard;