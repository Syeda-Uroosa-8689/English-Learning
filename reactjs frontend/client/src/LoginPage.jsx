import React, { useState } from "react";

function LoginPage({ onLogin, onBack }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if (!email.trim() || !password.trim()) {
      alert("Please enter Email and Password");
      return;
    }

    localStorage.setItem(
      "userName",
      email
    );

    onLogin();
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Welcome Back 🌟</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

        <button
          className="back-btn"
          onClick={onBack}
        >
          Back
        </button>

      </div>

    </div>
  );
}

export default LoginPage;