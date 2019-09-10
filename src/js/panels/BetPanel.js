import {Button, Card, Col, Form, Row} from "react-bootstrap";
import React, {Component} from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

class BetPanel extends Component {

    // BASELINE REACT FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////
    constructor(props) {
        super(props);
        this.state = {
            betValue: 0
        }
    }

    render() {
        if (!this.props.gameIsActive) {
            return (
                <Card className="d-flex flex-column bet-panel">
                    <Card.Header>Bet Credits</Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group as={Row} controlId="formPlaintextEmail">
                                <Col sm="1"/>
                                <Col sm="3">
                                    <Form.Label>
                                        Your Credits
                                    </Form.Label>
                                </Col>
                                <Col className={"align-text"} sm="4">
                                    <Form.Label>
                                        ♣ {this.props.activeProfileCredits}
                                    </Form.Label>
                                </Col>
                            </Form.Group>


                            <Form.Group as={Row} className="mb-3">
                                <Col sm="1"/>
                                <Col sm="3">
                                    <Form.Label>
                                        Your Bet
                                    </Form.Label>
                                </Col>
                                <InputGroup as={Col} sm={"4"} controlId="formPlaintextEmail">

                                    <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            ♣
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl name={"betField"} onChange={this.betFieldChangeManual}
                                                 value={this.state.betValue}/>


                                </InputGroup>
                            </Form.Group>

                            <ButtonToolbar as={Row} aria-label="Toolbar with button groups">
                                <ButtonGroup as={Col} sm="3">
                                    <Button variant="danger"
                                            onClick={() => this.betFieldChangeButton(-100)}>
                                        -100
                                    </Button>
                                    <Button variant="outline-danger" onClick={() => this.betFieldChangeButton(-10)}>
                                        -10
                                    </Button>
                                </ButtonGroup>


                                <ButtonGroup as={Col} sm={"6"}>
                                    <Button variant="dark"
                                            onClick={() => this.props.startGame(this.state.betValue)} block>
                                        Start Game
                                    </Button>
                                </ButtonGroup>


                                <ButtonGroup as={Col} sm={"3"}>
                                    <Button variant="outline-success" onClick={() => this.betFieldChangeButton(10)}
                                    >
                                        +10
                                    </Button>
                                    <Button variant="success" onClick={() => this.betFieldChangeButton(100)}
                                    >
                                        +100
                                    </Button>
                                </ButtonGroup>
                            </ButtonToolbar>
                        </Form>
                    </Card.Body>
                </Card>
            )
        } else {
            return null;
        }
    };

    // UPDATE & VALIDATION /////////////////////////////////////////////////////////////////////////////////////////////
    betFieldChangeManual = (event) => {
        console.log(`credits : ${event.target.value}/${this.props.activeProfileCredits}`);
        console.log(`difference : ${this.props.activeProfileCredits - event.target.value}`);
        if (!isNaN(event.target.value)
            && event.target.value >= 0
            && this.props.activeProfileCredits - event.target.value >= 0
            && event.target.value % 1 === 0
        ) {
            this.setState({
                betValue: event.target.value
            });
        }
    };

    betFieldChangeButton = (value) => {
        let newVal = this.state.betValue + value;
        let topVal = parseInt(this.props.activeProfileCredits);
        newVal = newVal <= 0 ? 0 : newVal >= topVal ? topVal : newVal;
        this.setState({
            betValue: newVal
        });
    };
}

function ControlButton(props) {
    let sign = '';
    if (this.props.incrementValue > 0) {
        sign = '+'
    }
    return (
        <Button variant="primary" onClick={() => this.betFieldChangeButton(this.props.incrementValue)} block>
            {sign}{this.props.incrementValue}
        </Button>
    )

}

export default BetPanel;