import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login({ setAuth }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email: email.trim().toLowerCase(),
        password: password,
      });

      // ✅ BACKEND RETURNS: res.data.token and res.data.user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);

      if (setAuth) setAuth(true);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-box">
      <h2>🔐 Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p className="register-link">
        Don’t have an account?{" "}
        <Link to="/register" className="link">
          Create Account
        </Link>
      </p>
    </div>
  );
}

export default Login;
