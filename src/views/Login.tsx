import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  return (
    <div>
      <h2>Login</h2>
      <button onClick={() => login("test@example.com", "password")}>Login</button>
    </div>
  );
};

export default Login;
