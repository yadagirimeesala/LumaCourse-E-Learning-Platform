import React,{ useState } from 'react';
import axios from '../api/axios';

function CreateCourse() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const token=localStorage.getItem('token');
            await axios.post('/courses', {
                title,
                description,
                price,
                category
            },{
                headers:{Authorization: `Bearer ${token}`}
            });
            setMessage('Course created successfully');
            setTitle('');
            setDescription('');
            setPrice('');
            setCategory('');
        }catch (error) {
            setMessage('Failed to create course');
        }
    };

    return(
        <div>
            <h2>Create a New Course</h2>
            <form onSubmit={handleSubmit}>
                <input type="text"
                placeholder='Course Title'
                value={title}
                onChange={e=> setTitle(e.target.value)}
                required />
                <br />
                <textarea 
                placeholder='Description'
                value={description}
                onChange={e=> setDescription(e.target.value)}
                required 
                />
                <br />
                <input type="number" placeholder='Price'
                value={price}
                onChange={e=> setPrice(e.target.value)}
                required 
                />
                <br />
                <input type="text" placeholder='Category'
                value={category} 
                onChange={e=> setCategory(e.target.value)}
                required/>
                <br />
                <button type='submit'>Create Course</button>
            </form>
            {message && <div style={{ color: "green", marginTop: 10 }}>{message}</div>}
        </div>
    );
}

export default CreateCourse;