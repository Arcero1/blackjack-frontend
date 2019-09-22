import React from "react";
import {
    Button,
    Card,
    Col,
    Form,
    Row,
    ButtonGroup,
    ButtonToolbar,
    InputGroup,
    FormControl
} from "react-bootstrap";
import {STORAGE} from "../../util/constants";

class BetPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            betValue: 0
        };
    }

    render() {
        if (!this.props.show) return null;

        return (
            <Card style={{textAlign: "center"}} className="d-flex flex-column bet-panel">
                <Card.Header>
                    Bet Credits
                </Card.Header>
                <Card.Body>
                    <Form
                        onSubmit={this.submitBet}>
                        <Form.Group as={Row}>
                            <Col sm="3" className={"bet-input-label"}>
                                <Form.Label>
                                    Your Credits
                                </Form.Label>
                            </Col>
                            <Col className={"align-text"} sm={{span: "4", offset: "1"}}>
                                <Form.Label>
                                    ♣ {this.props.activeProfileCredits}
                                </Form.Label>
                            </Col>
                        </Form.Group>


                        <Form.Group as={Row} className="mb-3">
                            <Col sm="3" className={"bet-input-label"}>
                                <Form.Label>
                                    Your Bet
                                </Form.Label>
                            </Col>
                            <InputGroup as={Col} sm={{span: "4", offset: "1"}} className={"bet-input-label"}>

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
                            <ButtonGroup as={Col} sm={"3"}>
                                <Button
                                    id={"bet-button-100n"}
                                    variant="danger"
                                    onClick={() => this.betFieldChangeButton(-100)}
                                >
                                    -100
                                </Button>
                                <Button
                                    id={"bet-button-10n"}
                                    variant="outline-danger"
                                    onClick={() => this.betFieldChangeButton(-10)}
                                >
                                    -10
                                </Button>
                            </ButtonGroup>


                            <ButtonGroup as={Col} sm={"6"}>
                                <Button
                                    id={"bet-button-game-start"}
                                    variant="dark"
                                    disabled={!STORAGE.profileName.getValue()}
                                    onClick={() => {
                                        this.props.startGame(this.state.betValue);
                                        this.setState({
                                            betValue: 0
                                        })
                                    }} block
                                >
                                    Start Game
                                </Button>
                            </ButtonGroup>


                            <ButtonGroup as={Col} sm={"3"}>
                                <Button
                                    id={"bet-button-10p"}
                                    variant="outline-success"
                                    onClick={() => this.betFieldChangeButton(10)}
                                >
                                    +10
                                </Button>
                                <Button
                                    id={"bet-button-100p"}
                                    variant="success"
                                    onClick={() => this.betFieldChangeButton(100)}
                                >
                                    +100
                                </Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                    </Form>
                </Card.Body>
            </Card>
        )
    }

    submitBet = (event) => {
        event.preventDefault();
        this.props.startGame(this.state.betValue);
    };

    // UPDATE & VALIDATION /////////////////////////////////////////////////////////////////////////////////////////////
    betFieldChangeManual = (event) => {
        if (!isNaN(event.target.value)
            && event.target.value >= 0
            && this.props.activeProfileCredits - event.target.value >= 0
            && event.target.value % 1 === 0
            && !/[.]/.test(event.target.value)
        ) {
            this.setState({
                betValue: parseInt(event.target.value)
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

export default BetPanel;