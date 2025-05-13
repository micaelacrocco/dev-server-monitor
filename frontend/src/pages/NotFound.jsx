import React from "react";
import styled from "styled-components";
import Button from "../components/Button"; 

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f7f7f5, #f7f7f5);
  color: #333;
  padding: 0 1rem;
`;

const ContentContainer = styled.div`
  text-align: center;
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
`;

const NotFoundTitle = styled.h1`
  font-size: 9rem;
  font-weight: 700;
  color: #2b2a49;
  margin: 0;
`;

const Divider = styled.div`
  height: 0.5rem;
  width: 100%;
  background: linear-gradient(to right, #c2a4f9, #d9f175);
  border-radius: 9999px;
  margin: 1.5rem 0;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2b2a49;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #6a6a6a;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

function NotFound() {
  return (
    <PageContainer>
      <ContentContainer>
        <HeaderSection>
          <NotFoundTitle>Not Found</NotFoundTitle>
          <Divider />
        </HeaderSection>
        
        <SubTitle>Server down... or never existed.</SubTitle>
        <Description>The page you are looking for does not exist or has been moved.</Description>
        
        <ButtonContainer>
          <Button onClick={() => window.history.back()}>
            Go back
          </Button>
        </ButtonContainer>
      </ContentContainer>
    </PageContainer>
  );
}

export default NotFound;