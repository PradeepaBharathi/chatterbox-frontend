import React from "react";
import styled from "styled-components";
import robo from "../Assests/Animation - 1708091822607.gif";
function Welcome({ currentUser }) {
  console.log(currentUser);
  return (
    <Container>
      <img src={robo} alt="hello" />
      <h1>
        {" "}
        Welcome ,<span>{currentUser?.name}</span>
      </h1>
      <h3>Please select a chat to start texting</h3>
    </Container>
  );
}

export default Welcome;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-itms: center;
  flex-direction: column;
  color: white;
  img {
    height: 10rem;
    width: 10rem;
    margin:0 auto;
  }
`;
