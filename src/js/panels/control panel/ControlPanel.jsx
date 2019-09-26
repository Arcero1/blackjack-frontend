import React from "react";
import {
  ButtonGroup,
  Button
} from "react-bootstrap";


class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="d-flex flex-column control-panel">
        <ButtonGroup>
          <Button
            id={"control-button-hit"}
            className="control-panel-button control-panel-button-large"
            variant="success"
            onClick={this.props.hit}
            disabled={this.props.disableControls}
          >
            HIT
          </Button>
          <Button
            id={"control-button-stand"}
            className="control-panel-button control-panel-button-large"
            variant="warning"
            onClick={this.props.stand}
            disabled={this.props.disableControls}
          >
            STAND
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button className="control-panel-button"
                  variant="secondary"
                  disabled
          />
        </ButtonGroup>

        <ButtonGroup>
          <Button
            className="control-panel-button"
            variant="secondary"
            disabled
          />
        </ButtonGroup>
      </div>
    );
  }
}

export default ControlPanel;