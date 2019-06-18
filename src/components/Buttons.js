import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 50px;
  text-align: center;
`;

const ButtonsWrapper = styled.div`
`;

const Button = styled.button`
  margin: 0 10px;
  font-size: 18px;
  width: 150px;
  height: 50px;
  border-radius: 10px;
  cursor: pointer;
`;

const ValidButton = styled(Button)`
  background: #9acd32;
`;

const InvalidButton = styled(Button)`
  background: #ff7f7f;
`;

const CheckButton = styled(Button)`
  background: #eee;
`;

const DownloadButton = styled(Button)`
  margin-top: 30px;
  background: #dbbff6;
`;

const Buttons = ({ training, checkVote, addToDataset, download }) => (
  <Wrapper>
    {training ? (
      <ButtonsWrapper>
        <ValidButton onClick={() => addToDataset(true)}>
          Ważny
        </ValidButton>
        <InvalidButton onClick={() => addToDataset(false)}>
          Nieważny
        </InvalidButton>
        <DownloadButton onClick={() => download()}>
          Pobierz dataset
        </DownloadButton>
      </ButtonsWrapper>
    ) : (
      <CheckButton onClick={checkVote}>
        Zagłosuj
      </CheckButton>
    )}
  </Wrapper>
);

export default Buttons;