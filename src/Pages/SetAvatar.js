import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import loading from "../Assests/Spinner-1s-200px (1).gif";
import { setAvatarRoute } from "../Utils/APIRoutes";

function SetAvatar() {
  const [avatar, setAvatar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const nav = useNavigate();

  const api = "https://api.multiavatar.com/";
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    async function fetchData() {
     
      const data = [];
      
      for (let i = 0; i < 4; i++) {
       
          const randomSeed = Math.random().toString(36).substring(7);
          const image = await axios.get(`${api}${randomSeed}.svg`, {
            responseType: "blob",
          });

          const reader = new FileReader();
          reader.readAsDataURL(image.data);
          reader.onloadend = () => {
            data.push(reader.result);
            if (data.length === 4) {
              setAvatar(data);
              setIsLoading(false);
            }
          };
        
       
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("USER")) {
      nav("/login");
    }
  }, [nav]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("USER"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatar[selectedAvatar],
      });
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("USER", JSON.stringify(user));
        nav("/chats");
      } else {
        toast.error("Error setting avatar,please try again", toastOptions);
      }
    }
  };
  return (
    <div>
      {isLoading ? (
        <Container>
          <img src={loading} alt="loading" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatar.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                  key={index}
                >
                  <img
                    src={avatar}
                    alt="avatar"
                    style={{ height: "100px", width: "100px" }}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as profile picture
          </button>
        </Container>
      )}

      <ToastContainer />
    </div>
  );
}

export default SetAvatar;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  background-color: black;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }
    }
    .selected {
      border: 0.4rem solid #480298;
    }
  }
  .submit-btn {
    background-color: #d3d0cbff;
    color: #480298;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;

    &:hover {
      background-color: #d3d0cbff;
    }
  }
`;
