import React from 'react';
import styled from 'styled-components';

import CONSTANTS from '../helpers/constants';

const Wrapper = styled.div`
  margin-top: 50px;
  text-align: center;
  display: flex;
`;

const Button = styled.button`
  cursor: pointer;
`;

const Canvas = styled.canvas`
  height: ${CONSTANTS.CANVAS_SIZE}px;
  width: ${CONSTANTS.CANVAS_SIZE}px;
  border: 1px solid #000;
  margin-left: auto;
`;

class Board extends React.Component {
  state = {
    drawing: false
  }

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.props.fields.forEach((item, index) => {
      if (item === 1) {
        this.drawPoint(this.getFieldDetails(index, null, null));
      }
    });
  }

  startDrawing(event) {
    const canvas = this.canvasRef.current;
    const x = event.pageX - canvas.offsetLeft;
    const y = event.pageY - canvas.offsetTop;

    this.setState({ drawing: true });
    this.checkPointIfEmpty(this.getFieldDetails(null, x, y));
  }

  getFieldDetails(i, x, y) {
    return i ? {
        i,
        x: Math.floor(x / CONSTANTS.AREA),
        y: Math.floor(y / CONSTANTS.AREA)
      } : {
        i: Math.floor(y / CONSTANTS.AREA) * CONSTANTS.BOARD_SIZE + Math.floor(x / CONSTANTS.AREA),
        x: Math.floor(x / CONSTANTS.AREA),
        y: Math.floor(y / CONSTANTS.AREA)
      };
  }

  checkPointIfEmpty({ i, x, y }) {
    const { fields } = this.props;

    if (fields[i] === 0) {
      this.drawPoint({ i, x, y });
      this.props.updateCanvas(i);
    }
  }

  drawPoint({ i, x, y }) {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillRect(x, y, canvas.width / CONSTANTS.BOARD_SIZE, canvas.height / CONSTANTS.BOARD_SIZE);
  }

  move(event) {
    const { drawing } = this.state;
    const canvas = this.canvasRef.current;
    const x = event.pageX - canvas.offsetLeft;
    const y = event.pageY - canvas.offsetTop;

    if (drawing) {
      this.checkPointIfEmpty(this.getFieldDetails(null, x, y));
    }
  }

  stopDrawing() {
    this.setState({ drawing: false });
  }

  clearCanvas() {
    this.props.clearCanvas();
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  render() {
    return (
      <Wrapper>
        <Button onClick={() => this.clearCanvas()}>
          Wyczyść
        </Button>
        <Canvas
          width={CONSTANTS.BOARD_SIZE}
          height={CONSTANTS.BOARD_SIZE}
          ref={this.canvasRef}
          onMouseDown={(event) => this.startDrawing(event)}
          onMouseUp={() => this.stopDrawing()}
          onMouseMove={(event) => this.move(event)}
        />
      </Wrapper>
    );
  }
}

export default Board;