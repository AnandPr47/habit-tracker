import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.type]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      // ✅ Token Save
      localStorage.setItem("token", res.data.token);

      // ✅ Redirect
      navigate("/dashboard");

    } catch (error) {
      alert("Login failed ❌");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass">
        <h2 className="login-title">Welcome Back</h2>

        <div className="input-group">
          <input type="email" required onChange={handleChange} />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input type="password" required onChange={handleChange} />
          <label>Password</label>
        </div>

        <button className="login-btn" onClick={handleSubmit}>
          Login
        </button>

        <p className="back-text" onClick={() => navigate("/register")}>
          Don’t have an account? Sign Up
        </p>

        <p className="back-text" onClick={() => navigate("/")}>
          ← Back to Home
        </p>
      </div>
    </div>
  );
}



export default Login;