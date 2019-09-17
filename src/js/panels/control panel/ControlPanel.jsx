import React, {Component} from "react";
import {ButtonGroup, Button} from "react-bootstrap";


class ControlPanel extends Component {
    // BASELINE REACT //////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="d-flex flex-column control-panel">
                <ButtonGroup aria-label="Basic example">
                    <Button className="control-panel-button control-panel-button-large" variant="success"
                            onClick={this.props.hit} disabled={this.props.disableControls}>
                        HIT
                    </Button>
                    <Button className="control-panel-button control-panel-button-large" variant="warning"
                            onClick={this.props.stand} disabled={this.props.disableControls}>
                        STAND
                    </Button>
                </ButtonGroup>

                <ButtonGroup aria-label="Basic example">
                    <Button className="control-panel-button" variant="secondary" disabled>
                        DOUBLE
                    </Button>
                </ButtonGroup>

                <ButtonGroup aria-label="Basic example">
                    <Button className="control-panel-button" variant="secondary" disabled>
                        SURRENDER
                    </Button>
                </ButtonGroup>

            </div>
        );
    }

}

export default ControlPanel;