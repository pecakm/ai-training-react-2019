import React from 'react';
import styled from 'styled-components';

const Section = styled.div`
  background: #eee;
  height: 60px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  height: 100%;
`;

const Title = styled.h1`
  margin: 0;
`;

const Button = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
`;

const Header = ({ training, changeMode }) => (
  <Section>
    <Wrapper>
      <Title>
        Vote Validation
      </Title>
      <Button onClick={changeMode}>
        {training ? ("Głosuj") : ("Trenuj")}
      </Button>
    </Wrapper>
  </Section>
);

export default Header;