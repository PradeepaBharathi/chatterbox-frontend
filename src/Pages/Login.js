import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../Utils/APIRoutes";
function Login() {
  const nav = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleValidations = () => {
    const { username, password } = values;
    if (password.length == "") {
      toast.error("Please enter all details", toastOptions);
      return false;
    } else if (username.length == " ") {
      toast.error("Please enter all details", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidations()) {
      const { username, password } = values;
      try {
        const response = await axios.post(loginRoute, { username, password });
        console.log(response);
        const { data } = response;
        if (
          data.status === 404 &&
          data.msg === "Incorrect username or password"
        ) {
          toast.error(data.msg, toastOptions);
        } else if (data.status === 201) {
          localStorage.setItem("USER", JSON.stringify(data.user));
          nav("/chats");
        }
      } catch (error) {
        console.error("Error during login:", error);
        toast.error("Incorrect username or password", toastOptions);
      }
    }
  };

  return (
    <div>
      <FormContainer>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="brand">
            <h2>CHATTER BOX</h2>
          </div>
          <input
            type="text"
            placeholder="Enter Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />

          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />

          <button type="submit">LOGIN</button>
          <span>
            Don't have an account ? <Link to="/">Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </div>
  );
}

export default Login;

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: black;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h2 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: #480298;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid black;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid black;
      outline: none;
    }
  }
  button {
    background-color: black;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: white;
      color: black;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: black;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
