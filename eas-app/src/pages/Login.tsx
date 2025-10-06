import React, { useState } from "react";
import styled from "styled-components";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContent";

const Login = () => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      setUser(user);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <h2 className="form-title">Employee Attendance System</h2>
          {error && <p className="error">{error}</p>}

          <div className="input-container">
            <input
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span>
              <svg
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>

          <div className="input-container">
            <input
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span>
              <svg
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <path
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>

          <button className="submit" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: radial-gradient(circle at center, #1a1a1a 0%, #000 100%);
  font-family: "Poppins", sans-serif;
  padding: 1rem;

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .form {
    background-color: #fff;
    padding: 2rem;
    width: 100%;
    max-width: 380px;
    border-radius: 0.75rem;
    box-shadow: 0 15px 25px rgba(255, 0, 0, 0.2);
    border-top: 4px solid #e50914;
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  .form:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 30px rgba(255, 0, 0, 0.25);
  }

  .form-title {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    color: #111;
    margin-bottom: 1.5rem;
  }

  .error {
    background: rgba(229, 9, 20, 0.1);
    color: #e50914;
    border: 1px solid #e50914;
    padding: 0.6rem;
    border-radius: 0.5rem;
    text-align: center;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .input-container {
    position: relative;
    margin-top: 1rem;
  }

  .input-container input {
    width: 100%;
    padding: 0.9rem 2.5rem 0.9rem 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    color: #111;
    background: #f9f9f9;
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  .input-container input:focus {
    border-color: #e50914;
    background: #fff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.15);
  }

  .input-container span {
    position: absolute;
    right: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }

  .submit {
    margin-top: 1.5rem;
    background-color: #e50914;
    color: white;
    font-weight: 600;
    padding: 0.9rem;
    width: 100%;
    border-radius: 0.5rem;
    border: none;
    text-transform: uppercase;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .submit:hover {
    background-color: #b00610;
    transform: scale(1.02);
  }

  .signup-link {
    color: #444;
    font-size: 0.9rem;
    text-align: center;
    margin-top: 1.2rem;
  }

  .signup-link a {
    color: #e50914;
    text-decoration: none;
    font-weight: 500;
  }

  .signup-link a:hover {
    text-decoration: underline;
  }

  /* ✅ Responsive Design */
  @media (max-width: 480px) {
    .form {
      padding: 1.5rem;
      max-width: 95%;
    }

    .form-title {
      font-size: 1.25rem;
    }

    .input-container input {
      padding: 0.8rem 2rem 0.8rem 1rem;
      font-size: 0.85rem;
    }

    .submit {
      font-size: 0.85rem;
      padding: 0.8rem;
    }
  }
`;

export default Login;
