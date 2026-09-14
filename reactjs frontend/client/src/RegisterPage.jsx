import React, { useState } from "react";

function RegisterPage({ onRegister, onBack }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
     alert("Button Clicked");

    try {

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();

      if(data.success){
        alert("Registration Successful");
        onRegister();
      }
      else{
        alert(data.message);
      }

    } catch(error){
  console.error("Register Error:", error);
  alert("Backend server not running!");
}

  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Create Account ✨</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>
          Register
        </button>

        <button className="back-btn" onClick={onBack}>
          Back
        </button>

      </div>

    </div>
  );
}

export default RegisterPage;