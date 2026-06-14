import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/api";
import "../styles/register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      alert("Registered Successfully 🎉");
    } catch (err) {
      alert("Registration Failed ❌");
    }
  };

  return (
  <div className="register-container">
    <div className="register-card">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
        <p className="login-link">
  Already have an account?{" "}
  <span onClick={() => navigate("/login")}>
    Login
  </span>
</p>
      </form>
    </div>
  </div>
);
}

export default Register;