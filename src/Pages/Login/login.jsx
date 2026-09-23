// LoginPage.jsx
import { useState } from "react";
import "./Login.scss";

export default function LoginPage({ onLoginSuccess }) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault(); 
    setStatusMessage("");

    // Local Storage check for verification
    const savedData = localStorage.getItem("erp_user_data");
    
    if (!savedData) {
      setStatusMessage("❌ Registration profile records missing in local storage!");
      return;
    }

    const registeredUser = JSON.parse(savedData);

    // Dynamic email evaluation parameters comparison check
    if (
      registeredUser.email.trim().toLowerCase() === email.trim().toLowerCase() && 
      registeredUser.password === password ){
      setStatusMessage("✅ Access Granted! Dashboard Loading...");
      

      setTimeout(() => {
        onLoginSuccess(); 
      }, 1200);

    } else {
      setStatusMessage("❌ Access Denied! Entered email does not match.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">ERP Login</h2>
        <form className="auth-form" onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email" 
              className="form-input" 
              required 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password" 
              className="form-input" 
              required 
            />
          </div>
          <button type="submit" className="register-btn">Login</button>
        </form>
        {statusMessage && <p className={`status-msg ${statusMessage.includes("✅") ? "success" : "error"}`}>{statusMessage}</p>}
      </div>
    </div>
  );
}
