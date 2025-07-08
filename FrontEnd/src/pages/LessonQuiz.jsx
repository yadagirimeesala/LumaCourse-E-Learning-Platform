import React, { useState, useEffect, use } from "react";
import axios from "../api/axios";


function LessonQuiz({ courseId, lessonId, role }) {
    const [quiz, setQuiz] = useState([]);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
    const [editIndex, setEditIndex] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Quiz submission effect
    const [studentAnswers, setStudentAnswers] = useState([]);
    const [score, setScore] = useState(null);
    const [attemptError, setAttemptError] = useState("");

    useEffect(() => {
        if (lessonId) {
            fetchQuiz();
        }
    }, [lessonId]);

    useEffect(() => {
        if (role === "student" && quiz.length > 0) {
            // Initialize student answers array based on quiz length
            setStudentAnswers(new Array(quiz.length).fill(null));
            setScore(null);
        }
    },[ quiz, role]);

    const fetchQuiz = async () => {
        try {
            const res = await axios.get(`/courses/${courseId}/lessons/${lessonId}/quiz`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setQuiz(res.data);
        } catch {
            setQuiz([]);
        }
    };

    const handleAddQuiz = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        try {
            if (editIndex !== null) {
                await axios.put(
                    `/courses/${courseId}/lessons/${lessonId}/quiz/${editIndex}`,
                    { question, options, correctAnswerIndex },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setMessage("Quiz question updated!");

            } else {
                await axios.post(
                    `/courses/${courseId}/lessons/${lessonId}/quiz`,
                    { question, options, correctAnswerIndex },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setMessage("Quiz question added!");
            }
            setQuestion("");
            setOptions(["", "", "", ""]);
            setCorrectAnswerIndex(0);
            setEditIndex(null);
            fetchQuiz();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add quiz");
        }
    };

    return (
        <div style={{ marginTop: 10, marginBottom: 10, border: "1px solid #444", padding: 10 }}>
            {role === "instructor" && (
                <form onSubmit={handleAddQuiz}>
                    <div>
                        <input
                            type="text"
                            placeholder="Question"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            required
                            style={{ width: "100%" }}
                        />
                    </div>
                    {options.map((opt, idx) => (
                        <div key={idx}>
                            <input
                                type="text"
                                placeholder={`Option ${idx + 1}`}
                                value={opt}
                                onChange={e => {
                                    const newOpts = [...options];
                                    newOpts[idx] = e.target.value;
                                    setOptions(newOpts);
                                }}
                                required
                            />
                        </div>
                    ))}
                    <div>
                        <label>Correct Answer:</label>
                        <select
                            value={correctAnswerIndex}
                            onChange={e => setCorrectAnswerIndex(Number(e.target.value))}
                        >
                            {options.map((_, idx) => (
                                <option key={idx} value={idx}>{`Option ${idx + 1}`}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit">
                        {editIndex !== null ? "Update Quiz Question" : "Add Quiz Question"}
                    </button>
                    {editIndex !== null && (
                        <button type="button" onClick={() => {
                            setEditIndex(null);
                            setQuestion("");
                            setOptions(["", "", "", ""]);
                            setCorrectAnswerIndex(0);
                        }}>Cancel Edit</button>
                    )}
                </form>
            )}
            {message && <div style={{ color: "green" }}>{message}</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            {role === "instructor" && (
            <div>
                <strong>Quiz Questions:</strong>
                <ul>
                    {quiz.map((q, idx) => (
                        <li key={idx}>
                            <b>Q:</b> {q.question}
                            <ul>
                                {q.options.map((opt, i) => (
                                    <li key={i} style={{ fontWeight: i === q.correctAnswerIndex ? "bold" : "normal" }}>
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                            
                                <>
                                    <button onClick={() => {
                                        setEditIndex(idx);
                                        setQuestion(q.question);
                                        setOptions([...q.options]);
                                        setCorrectAnswerIndex(q.correctAnswerIndex);
                                    }}>Edit</button>
                                    <button style={{ color: "red" }} onClick={async () => {
                                        setError("");
                                        setMessage("");
                                        try {
                                            await axios.delete(
                                                `/courses/${courseId}/lessons/${lessonId}/quiz/${idx}`,
                                                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                                            );
                                            setMessage("Quiz question deleted!");
                                            fetchQuiz();
                                        } catch (err) {
                                            setError(err.response?.data?.message || "Failed to delete quiz");
                                        }
                                    }}
                                    >Delete</button>
                                </>
                           
                        </li>
                    ))}
                </ul>
            </div>
             )}

            {/* student form */}
            {role === "student" && (
                <form onSubmit={async e => {
                    e.preventDefault();
                    setAttemptError("");
                    setScore(null);
                    try {
                        const res = await axios.post(
                            `/courses/${courseId}/lessons/${lessonId}/quiz/submit`,
                            { answers: studentAnswers },
                            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                        );
                        setScore(res.data.score);
                    } catch (err) {
                        setAttemptError(err.response?.data?.message || "Failed to submit quiz");
                    }
                }} style={{ marginTop: 20 }}>
                    <h4>Attempt Quiz</h4>
                    {quiz.map((q, idx) => (
                        <div key={idx} style={{ marginBottom: 10 }}>
                            <div><b>Q{idx + 1}:</b> {q.question}</div>
                            {q.options.map((opt, i) => (
                                <label key={i} style={{ display: "block", marginLeft: 20 }}>
                                    <input
                                        type="radio"
                                        name={`q${idx}`}
                                        value={i}
                                        checked={studentAnswers[idx] === i}
                                        onChange={() => {
                                            const updated = [...studentAnswers];
                                            updated[idx] = i;
                                            setStudentAnswers(updated);
                                        }}
                                        required
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    ))}
                    <button type="submit">Submit Quiz</button>
                    {score !== null && (
                        <div style={{ color: "green", marginTop: 10 }}>
                            Your Score: {score} / {quiz.length}
                        </div>
                    )}
                    {attemptError && <div style={{ color: "red" }}>{attemptError}</div>}

                </form>
            )}
        </div>
    )
}

export default LessonQuiz;