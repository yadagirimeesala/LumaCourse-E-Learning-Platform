import React  from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const isLoggedIn=!!localStorage.getItem("token");
    return isLoggedIn ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;