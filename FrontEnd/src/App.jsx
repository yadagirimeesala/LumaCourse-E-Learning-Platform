import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashBoard';
import InstructorDashboard from './pages/InstructorDashBoard';
import ProtectedRoute from './pages/ProtectedRoute';
import CourseCatalog from './pages/CourseCatalog';
import CreateCourse from './pages/CreateCourse';
import CourseLessons from './pages/CourseLessons';
import './App.css';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');

  return (
    <div>
      <nav>
        <Link to='/'>Home</Link>
        {!isLoggedIn && <Link to='/login'>Login</Link>}
        {!isLoggedIn && <Link to='/register'>Register</Link>}
        <Link to='/courses'>Courses</Link>
        {isLoggedIn && (
          <>
            {/* Dashboard link based on role */}
            {role === "student" && (
              <Link to='/student-dashboard' style={{ marginLeft: '10px' }}>Dashboard</Link>
            )}
            {role === "instructor" && (
              <Link to='/instructor-dashboard' style={{ marginLeft: '10px' }}>Dashboard</Link>
            )}
            {role === "instructor" && (
              <Link to='/create-course' style={{ marginLeft: '10px' }}>Create Course</Link>
            )}
            <span style={{ marginLeft: '10px', color: '#61dafb' }}>
              {name}({role})
            </span>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/login';
              }}
              style={{
                marginLeft: '10px',
                padding: '4px 12px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        )}
      </nav>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/student-dashboard' element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path='/instructor-dashboard' element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>} />
        <Route path='/courses' element={<CourseCatalog />} />
        <Route path='/create-course' element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
        <Route path='/courses/:courseId/lessons' element={<ProtectedRoute><CourseLessons /></ProtectedRoute>} />
        <Route path='/student-dashboard' element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      </Routes>
    </div>

  )
}

export default App
