import React from "react";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../Utils/APIRoutes";
import Contacts from "../Components/Contacts";
import Welcome from "../Components/Welcome";
import ChatContainer from "../Components/ChatContainer";
import io from "socket.io-client";
import SwipeableTemporaryDrawer from "../Components/TemporaryDrawer";

function Chat() {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const nav = useNavigate();
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const[isMobileView,setIsMobileView] = useState(false) 
  useEffect(() => {
    async function fetchCurrentUser() {
      if (!localStorage.getItem("USER")) {
        nav("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("USER")));
        setIsLoaded(true);
      }
    }

    fetchCurrentUser();
  }, [nav]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const { data } = await axios.get(
              `${allUsersRoute}/${currentUser._id}`
            );
            setContacts(data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        } else {
          nav("/setAvatar");
        }
      }
    }

    fetchData();
  }, [currentUser, nav]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth<720)
    }
    window.addEventListener("resize", handleResize)
    handleResize()

    return ()=>window.removeEventListener("resize",handleResize)
  },[])
  return (
    <Container>
      <div className="container">
        {isMobileView ? (<SwipeableTemporaryDrawer contacts={contacts} handleChatChange={handleChatChange} />):
       ( <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />)}
        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;

  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: black;
  .container {
    border-radius: 10px;
    height: 85vh;
    width: 85vw;
    background-color: #343145;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and(min-width:720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
    
  }
`;
