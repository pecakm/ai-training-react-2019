import React from 'react';
import styled from 'styled-components';

import TEST_VOTES from '../train_data.json';
import VALIDATE_VOTES from '../valid_data.json';

import CONSTANTS from '../helpers/constants';
import Header from '../components/Header';
import Board from '../components/Board';
import Buttons from '../components/Buttons';

const Wrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
`;

const SectionTitle = styled.h1`
  margin: 50px 0 0;
  text-align: center;
`;

var TEST_GUESSED = 0;
var TEST_OVERALL = 0;
var VAL_GUESSED = 0;
var VAL_OVERALL = 0;

class App extends React.Component {
  state = {
    training: false,
    fields: Array(CONSTANTS.BOARD_SIZE * CONSTANTS.BOARD_SIZE).fill(0)
  };

  constructor(props) {
    super(props);
    this.dataset = TEST_VOTES;
    this.currentWeights = this.trainedWeights();
  }

  componentDidMount() {
    VALIDATE_VOTES.forEach(vote => {
      if (this.checkVote(this.currentWeights, vote.fields) === vote.valid) {
        VAL_GUESSED++;
      };
      VAL_OVERALL++;
    });

    console.log(`VAL_DATASET: ${VAL_GUESSED} / ${VAL_OVERALL} (${VAL_GUESSED / VAL_OVERALL})`);
  }

  generateRandomWeights() {
    const weights = Array(CONSTANTS.BOARD_SIZE * CONSTANTS.BOARD_SIZE).fill(0).map(item => (
      Math.random() * 2 - 1
    ));

    return weights;
  }

  trainedWeights() {
    let currentWeights = this.generateRandomWeights();

    for (let i = 0; i < 5; i++) {
      for (const example of TEST_VOTES) {
        currentWeights = this.train(currentWeights, example.fields, example.valid);
      }
  
      console.log(`TRAIN_DATASET: ${TEST_GUESSED} / ${TEST_OVERALL} (${TEST_GUESSED / TEST_OVERALL})`);
      TEST_GUESSED = 0;
      TEST_OVERALL = 0;
    }

    return currentWeights;
  }

  train(weights, vote, valid) {
    const checkResult = this.checkVote(weights, vote) ? 1 : 0;
    const error = valid - checkResult;
    const learningRate = 1;
    const validResult = valid ? 1 : 0;

    if (checkResult === validResult) {
      TEST_GUESSED++;
    }

    TEST_OVERALL++;

    return Array(CONSTANTS.BOARD_SIZE * CONSTANTS.BOARD_SIZE).fill(0).map((item, index) => (
      weights[index] + vote[index] * error * learningRate
    ));
  }

  checkVote(weights, vote) {
    let sum = 0;

    for (const [i, field] of vote.entries()) {
      sum += field * weights[i];
    }
    
    return sum >= 10;
  }

  checkVoteFromCanvas() {
    const { fields } = this.state;
    let sum = 0;

    for (const [i, field] of fields.entries()) {
      sum += field * this.currentWeights[i];
    }

    const message = sum >= 10 ? 'GŁOS WAŻNY' : 'GŁOS NIEWAŻNY';

    alert(message);
  }

  addToDataset(valid) {
    this.dataset.push({
      fields: this.state.fields,
      valid
    });

    this.clearCanvas();

    console.log(this.dataset);
  }

  clearCanvas() {
    this.setState({
      fields: Array(CONSTANTS.BOARD_SIZE * CONSTANTS.BOARD_SIZE).fill(0)
    });
  }

  updateCanvas(i) {
    this.setState(prevState => {
      const newFields = prevState.fields.map((item, index) => {
        if (index === i) {
          return 1;
        } else {
          return item
        }
      });

      return { ...prevState, fields: newFields };
    });
  }

  download() {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(this.dataset)], {type: 'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = 'train_data.json';
    a.click();
  }

  changeMode() {
    this.setState(prevState => (
      { training: !prevState.training }
    ));
  }

  render() {
    const { training, fields } = this.state;

    return (
      <div>
        <Header training={training} changeMode={() => this.changeMode()} />
        <Wrapper>
          <SectionTitle>
            {training ? 'TRENOWANIE' : 'GŁOSOWANIE'}
          </SectionTitle>
          <Board
            fields={fields}
            updateCanvas={(index) => this.updateCanvas(index)}
            clearCanvas={() => this.clearCanvas()}
          />
          <Buttons
            training={training}
            checkVote={() => this.checkVoteFromCanvas()}
            addToDataset={(valid) => this.addToDataset(valid)}
            download={() => this.download()}
          />
        </Wrapper>
      </div>
    );
  }
}

export default App;
