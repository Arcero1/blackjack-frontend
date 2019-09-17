import React, {Component} from "react";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import {API_ADDRESS} from "../../address";

class LoginDashboard extends Component {
    // BASELINE REACT //////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(props) {
        super(props);
        this.state = {
            userExists: true,

            emailInvalidMessage: "",
            passwordInvalidMessage: "",
            isExpanded: false
        }
    }

    render() {
        if (!this.props.show) {
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
        } else {
            return null;
        }
    };

    loginButton = () => {
        let buttonText = this.state.userExists ? "LogIn" : "Create Account";

        if (!this.state.userExists && (this.state.emailInvalidMessage || this.state.passwordInvalidMessage)) {
            return (
                <OverlayTrigger
                    placement="bottom-middle"
                    overlay={
                        <Tooltip id="tooltip-disabled">
                            {this.state.emailInvalidMessage ? `email: ${this.state.emailInvalidMessage}` : null}
                            <br/>
                            {this.state.passwordInvalidMessage ? `password: ${this.state.emailInvalidMessage}` : null}
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
    };


    login() {
        console.log("logging in . . . ");
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

export default LoginDashboard;