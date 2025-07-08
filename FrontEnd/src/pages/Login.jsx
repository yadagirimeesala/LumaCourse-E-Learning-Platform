
import React, { useState } from 'react';
import axios from '../api/axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try{
            const res = await axios.post('/users/login', { email, password });
            localStorage.setItem('token', res.data.token); // Store the token in local storage
            localStorage.setItem('role',res.data.role);
            localStorage.setItem('name',res.data.name);
            localStorage.setItem('userId',res.data._id);
        
            // Redirect based on role
            if (res.data.role === 'student') {
                window.location.href = '/student-dashboard';
            } else if (res.data.role === 'instructor') {
                window.location.href = '/instructor-dashboard';
            } else {
                window.location.href = '/';
            }
        }catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    }
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label >Email:</label>
                    <input type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder='Enter your email'
                        style={{ width: '100%', marginBottom: 10 }}
                    // style={{ width: '100%', padding: '8px', margin: '4px 0', boxSizing: 'border-box' }} />
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        placeholder='Enter your password'
                        style={{ width: '100%', marginBottom: 10 }}
                        />
                </div>
                <button type='submit'>Login</button>
                {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
            </form>
        </div>

    );
}

export default Login;