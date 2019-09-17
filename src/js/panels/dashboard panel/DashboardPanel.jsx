import React, {Component} from 'react';
import {Accordion, Card} from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";

import {API_ADDRESS} from "../../address";
import LoginDashboard from "./dashboards/login/LoginDashboard"
import AccountDashboard from "./dashboards/account/AccountDashboard";

class DashboardPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            leaderBoardItems: [],
            emailInvalidMessage: 'fill in your email',
            passwordInvalidMessage: 'fill in your password',
            loggedIn: false,
            alias: '',
            gamesPlayed: '',
            gamesWon: '',
            hasInfo: false
        };

        this.getLeaderboard();
        this.checkIfLoggedIn();
    }

    checkIfLoggedIn = () => {
        if (!this.state.loggedIn && localStorage.getItem('userName')) {

            this.setState({
                loggedIn: true
            })
        }
    };

    getLeaderboard = () => {
        fetch(`${API_ADDRESS}/profiles/leaderboard`)
            .then(leaders => leaders.json())
            .then(leaders => {
                this.setState({
                    leaderBoardItems: leaders
                })
            })
    };

    profileTag = () => {
        if (sessionStorage.getItem('profileName')) {
            return sessionStorage.getItem('profileName');
        }
        return "profile";
    };

    render() {

        this.checkIfLoggedIn();
        return (
            <Accordion>
                <Card>
                    <Accordion.Toggle className={"info-panel-button"} as={Card.Header} eventKey="0">
                        <Row>
                            <Col sm="7">
                                {this.profileTag()}
                            </Col>
                            <Col>
                                <Button className={"change-profile-button"} variant="secondary" size="sm" onClick={() => this.setState({
                                    promptForProfile: true
                                })}>
                                    change
                                </Button>
                            </Col>
                        </Row>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body className={"info-panel-body"}>
                            <Row>
                                <Col sm="7">
                                    <LoginDashboard
                                        onLogin={() => this.setState({
                                            loggedIn: true
                                        })}
                                        show={this.state.loggedIn}
                                    />
                                    <AccountDashboard
                                        onLogout={() => this.setState({
                                            loggedIn: false
                                        })}
                                        show={this.state.loggedIn}
                                    />
                                </Col>
                                <Col sm="5">
                                    <h1>Leaderboard</h1>
                                    <ListGroup>
                                        {this.state.leaderBoardItems.map((item, index) => {
                                            return (
                                                <ListGroup.Item key={index}>
                                                    <Row>
                                                        <Col sm="7">
                                                            {item.name.toUpperCase()}
                                                        </Col>
                                                        <Col>
                                                            ♣ {item.credits}
                                                        </Col>
                                                    </Row>

                                                </ListGroup.Item>)
                                        })}
                                    </ListGroup>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    };
}


export default DashboardPanel;

