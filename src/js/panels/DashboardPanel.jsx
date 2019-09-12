import React, {Component} from 'react';
import {Accordion, Card} from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import {API_ADDRESS} from "../address";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Nav from "react-bootstrap/Nav";

class DashboardPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
            userExists: false,
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

            this.getUserInfo();
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
                    leaderBoardItems: [
                        leaders.user0,
                        leaders.user1,
                        leaders.user2,
                        leaders.user3,
                        leaders.user4,
                        leaders.user5,
                        leaders.user6,
                        leaders.user7,
                        leaders.user8,
                        leaders.user9,
                    ]
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
                                    {this.form()}
                                    {this.userPanel()}
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

    checkEmailStatus = (event) => {
        let message = '';
        let email = event.target.value;

        if (email !== '') {
            fetch(`${API_ADDRESS}users/validate/email?email=${email}`)
                .then(response => response.text())
                .then(text => this.setState({
                    userExists: text === 'success',
                }));

            if (email.indexOf("@") < 1 || email.length <= email.indexOf("@") + 1) {
                message = "invalid email";
            }
        } else {
            message = "fill in your password";
        }

        this.setState({
            emailInvalidMessage: message
        })
    };

    checkPasswordStatus = (event) => {
        let password = event.target.value;
        let message = '';

        if (password === "") {
            message = 'fill in your password';
        } else {
            if (/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                message += 'no special characters; \n';
            }
            if (!/[a-z]/.test(password)) {
                message += 'lowercase required; \n';
            }
            if (!/[A-Z]/.test(password)) {
                message += 'uppercase required; \n';
            }
            if(password.length < 8) {
                message += 'length must be more than 8; \n';
            }

            if (!/\d/.test(password)) {
                message += 'number required';
                ;
            }
        }

        this.setState({
            passwordInvalidMessage: message
        })
    };

    handleSubmit = (event) => {
        event.preventDefault();
    };

    handleLogin = () => {
        console.log("handling login . . . ");
        if (this.state.isExpanded && !this.state.userExists) {
            this.submitNewUser();
        } else if (!this.state.isExpanded && this.state.userExists) {
            this.login();
        } else {
            this.setState({
                isExpanded: !this.state.userExists
            })
        }
    };

    userPanel = () => {
        if (this.state.loggedIn) {
            return (
                <div>
                    <Row>
                        <Col sm={"6"}>
                            <h1>{this.state.alias}</h1>
                        </Col>
                    <ButtonGroup style={{pointerEvents: 'none'}} aria-label="Basic example" block>
                        <Button variant="outline-primary">statistics</Button>
                        <Button variant="primary">{this.state.gamesPlayed}P</Button>
                        <Button variant="success">{this.state.gamesWon}W</Button>
                        <Button variant="danger">{this.state.gamesPlayed - this.state.gamesWon}L</Button>
                    </ButtonGroup>
                    </Row>
                    <Row>
                        <Nav
                            onSelect={selectedKey => {
                                if(selectedKey === 'logout') {
                                    this.handleLogout();
                                } else if(selectedKey === 'delete-account') {
                                    this.deleteAccount();
                                }
                            }}
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="logout">LogOut</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="delete-account">Delete</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Row>
                </div>
            )
        }
    };

    handleLogout = () => {
        console.log("logging out . . . ");
        localStorage.removeItem('userName');
        this.setState({
            loggedIn: false
        })

    };

    deleteAccount = () => {

    };

    getUserInfo = () => {
        fetch(`${API_ADDRESS}users/info?email=${localStorage.getItem('userName')}`)
            .then(response => response.json())
            .then(json => {
                console.log("server to USER INFO : ");
                console.log(json)
                this.setState({
                    alias: json.alias,
                    gamesPlayed: json.games_played,
                    gamesWon: json.games_won
                })
            })
    };

    form = () => {

        if (!this.state.loggedIn) {
            return (
                <Form id={"userForm"} onSubmit={this.handleLogin}>
                    <Form.Group controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control onChange={this.checkEmailStatus} id={"email"} type="email"
                                      placeholder="Enter email"/>
                        <Form.Text className="text-muted">
                            Email is not shared and only used for account recovery purposes
                            <br/>
                            If you don't care about that, just make something up - we don't send validation emails
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={this.checkPasswordStatus} id={"password"} type="password"
                                      placeholder="Password"/>
                    </Form.Group>

                    {this.confirmPasswordField()}
                    {this.aliasField()}

                    <div className="d-flex flex-column">
                        {this.loginButton()}
                    </div>

                </Form>
            )
        }
    };

    loginButton = () => {
        let buttonText = this.state.userExists ? 'LogIn' : 'Create Account';

        if (!this.state.userExists && (this.state.emailInvalidMessage || this.state.passwordInvalidMessage)) {
            return (
                <OverlayTrigger
                    placement="bottom-middle"
                    overlay={
                        <Tooltip id="tooltip-disabled">
                            email: {this.state.emailInvalidMessage}
                            <br/>
                            password: {this.state.passwordInvalidMessage}
                        </Tooltip>}>
                        <span className="d-inline-block">
                            <Button variant="primary" onClick={this.handleLogin}
                                    disabled style={{pointerEvents: 'none'}} block>
                                {buttonText}
                            </Button>
                        </span>
                </OverlayTrigger>
            )
        }

        return (
            <Button variant="primary" onClick={this.handleLogin}
                    block>
                {buttonText}
            </Button>
        )
    };

    aliasField = () => {
        if (this.state.isExpanded) {
            return (
                <Form.Group controlId="alias">
                    <Form.Label>Alias</Form.Label>
                    <Form.Control type="name" placeholder="Optional"/>
                    <Form.Text className="text-muted">
                        The will replace the first part of your email on leaderboards
                    </Form.Text>
                </Form.Group>
            )
        }
    };

    confirmPasswordField = () => {
        if (this.state.isExpanded) {
            return (
                <Form.Group>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control controlId="password2" type="password" placeholder="Password"/>
                </Form.Group>
            )
        }
    }


    login() {
        console.log("logging in . . . ")
        fetch(`${API_ADDRESS}users/validate/password`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            })
        })
            .then(response => response.text())
            .then(text => {
                console.log("Login Response : " + text);
                if (text === 'success') {
                    localStorage.setItem('userName', document.getElementById('email').value);
                    this.checkIfLoggedIn();
                }
            });
    }

    submitNewUser() {
        fetch(`${API_ADDRESS}users/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            })
        })
            .then(response => console.log(response))
            .then(() => this.login());
    }

}


export default DashboardPanel;

