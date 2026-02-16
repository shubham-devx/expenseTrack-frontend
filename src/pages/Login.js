import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        await api.post("/auth/register", { email, password });
        alert("Registered Successfully! Please login.");
        setIsRegister(false);
      } else {
        await api.post("/auth/login", { email, password });
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center" }}>
          {isRegister ? "Register" : "Login"}
        </h2>

        <input
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          style={styles.input}
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleSubmit}>
          {isRegister ? "Register" : "Login"}
        </button>

        <p style={styles.switchText}>
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}
        </p>

        <button
          style={styles.switchButton}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Go to Login" : "Create Account"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4e73df, #1cc88a)"
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#4e73df",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },
  switchText: {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px"
  },
  switchButton: {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    background: "#1cc88a",
    color: "white",
    cursor: "pointer"
  }
};

export default Login;