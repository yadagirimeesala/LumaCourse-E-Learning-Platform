import axios from "../api/axios";
import React from "react";
import { useState, useEffect } from "react";

function CourseCatalog() {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");



    useEffect(()=>{
        axios.get('/courses').then(res=>setCourses(res.data)).catch(err=>setError("Failed to load Courses"));
    },[]);

    const handleEnroll = async (courseId) => {
        try{
            await axios.post(`/courses/${courseId}/enroll`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert("Enrolled successfully!");
        }catch(err){
            setError(err.response?.data?.message || "Failed to enroll in course");
        }
    };
    return(
        <div>
            <h2>Course Catalog</h2>
            {error && <div style={{color: "red"}}>{error}</div>}
            <ul>
                {courses.map(course =>(
                    <li key={course._id}>
                        <strong>{course.title}</strong> - {course.description} 
                        <button onClick={() => handleEnroll(course._id)}>Enroll</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CourseCatalog;