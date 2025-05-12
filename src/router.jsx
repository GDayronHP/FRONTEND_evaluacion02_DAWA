import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./modules/auth/pages/AuthPage";
import ModPage from "./modules/moderator/pages/ModPage";
import UserPage from "./modules/user/pages/UserPage";
import AdminPage from "./modules/admin/pages/AdminPage";
import UnauthorizedPage from "./modules/auth/pages/UnauthorizedPage";
import {
  AuthProvider,
  PrivateRoute,
  RoleBasedRoute,
} from "./modules/auth/context/AuthContext";
function Routing() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Rutas privadas */}
          <Route 
            path="/user" 
            element={
              <RoleBasedRoute role={"usuario"}>
                <UserPage />
              </RoleBasedRoute>
            } 
          />

          <Route 
            path="/moderator" 
            element={
              <RoleBasedRoute role={"moderador"}>
                <ModPage />
              </RoleBasedRoute>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <RoleBasedRoute role={"admin"}>
                <AdminPage />
              </RoleBasedRoute>
            } 
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default Routing;
