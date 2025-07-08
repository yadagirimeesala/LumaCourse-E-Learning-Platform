import React, { useState } from "react";
import axios from "../api/axios";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "student"
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await axios.post("/users/register", form);
            setSuccess("Registration successful! You can now login.");
            setForm({ name: "", email: "", password: "", role: "student" });
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} style={{ width: "300px", margin: "0 auto" }}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your name"
                        style={{ width: "100%", marginBottom: 10 }}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        style={{ width: "100%", marginBottom: 10 }}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                        style={{ width: "100%", marginBottom: 10 }}
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        style={{ width: "100%", marginBottom: 10 }}
                    >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                    </select>
                </div>
                <button type="submit">Register</button>
                {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
                {success && <div style={{ color: "green", marginTop: 10 }}>{success}</div>}
            </form>
        </div>
    );
}

export default Register;