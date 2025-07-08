import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import LessonQuiz from './LessonQuiz';

function CourseLessons() {
    const { courseId } = useParams();
    const [lessons, setLessons] = useState([]);
    const [title, setTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [editLessonId, setEditLessonId] = useState(null);
    const role = localStorage.getItem("role");

    useEffect(() => {
        axios.get(`/courses/${courseId}/lessons`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => setLessons(res.data))
            .catch(err => setError("Failed to load lessons"));
    }, [courseId]);

    const handleAddOrEditLesson = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        try {
            if (editLessonId) {
                // Edit lesson
                await axios.put(
                    `/courses/${courseId}/lessons/${editLessonId}`,
                    { title, videoUrl, description },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setMessage("Lesson updated!");
            } else {
                // Add lesson
                await axios.post(
                    `/courses/${courseId}/lessons`,
                    { title, videoUrl, description },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setMessage("Lesson added!");
            }
            setTitle("");
            setVideoUrl("");
            setDescription("");
            setEditLessonId(null);
            // Reload lessons
            const res = await axios.get(`/courses/${courseId}/lessons`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setLessons(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add/edit lesson");
        }
    };

    const handleEditClick = (lesson) => {
        setEditLessonId(lesson._id);
        setTitle(lesson.title);
        setVideoUrl(lesson.videoUrl);
        setDescription(lesson.description);
    };

    const handleDeleteClick = async (lessonId) => {
        setError("");
        setMessage("");
        try {
            await axios.delete(`/courses/${courseId}/lessons/${lessonId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setMessage("Lesson deleted!");
            // Reload lessons
            const res = await axios.get(`/courses/${courseId}/lessons`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setLessons(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete lesson");
        }
    }
    return (
        <div>
            <h2>Lessons</h2>
            {error && <div style={{ color: "red" }}>{error}</div>}
            {message && <div style={{ color: "green" }}>{message}</div>}
            {role === "instructor" && (
                <form onSubmit={handleAddOrEditLesson}>
                    <input
                        type="text"
                        placeholder="Lesson Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    /><br />
                    <input
                        type="text"
                        placeholder="Video URL"
                        value={videoUrl}
                        onChange={e => setVideoUrl(e.target.value)}
                        required
                    /><br />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    /><br />
                    <button type="submit">{editLessonId ? "Update Lesson" : "Add Lesson"}</button>
                    {editLessonId && (
                        <button type="button" onClick={() => {
                            setEditLessonId(null);
                            setTitle("");
                            setVideoUrl("");
                            setDescription("");
                        }}>Cancel</button>
                    )}
                </form>
            )}

            <ul>
                {lessons.map(lesson => (
                    <li key={lesson._id}>
                        <div>
                            <a href={lesson.videoUrl} target='_blank' rel='noopener noreferrer'>
                                Watch Video
                            </a>
                            {lesson.videoUrl && lesson.videoUrl.includes("youtube") && (
                                <div style={{ marginTop: 8 }}>
                                    <iframe
                                        width="420"
                                        height="236"
                                        src={lesson.videoUrl.replace("watch?v=", "embed/")}
                                        title={lesson.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}
                            <strong>{lesson.title}</strong> - {lesson.description}
                            {role === "instructor" && (
                                <>
                                    <button onClick={() => handleEditClick(lesson)} style={{ marginLeft: 10 }}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteClick(lesson._id)} style={{ marginLeft: 10, color: "red" }}>
                                        Delete
                                    </button>
                                </>
                            )}
                            <LessonQuiz courseId={courseId} lessonId={lesson._id} role={role} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CourseLessons;