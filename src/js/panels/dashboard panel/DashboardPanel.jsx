import React from 'react';
import {
    Accordion,
    Card,
    Button,
    Row,
    Col,
    ListGroup
} from 'react-bootstrap';

import {API_ADDRESS} from "../../constants";
import LoginDashboard from "./dashboards/login/LoginDashboard"
import AccountDashboard from "./dashboards/account/AccountDashboard";
import LeaderBoard from "./dashboards/leaderboard/LeaderBoard";

class DashboardPanel extends React.Component {

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

        this.checkIfLoggedIn();
    }

    checkIfLoggedIn = () => {
        if (!this.state.loggedIn && localStorage.getItem('userName')) {

            this.setState({
                loggedIn: true
            })
        }
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
                                <LeaderBoard />
                            </Row>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    };
}

export default DashboardPanel;

