import React from "react";
import {
    Form
} from "react-bootstrap";

import {API_ADDRESS} from "../../../../util/server";
import LogInButton from "./buttons/LogInButton";

const msg = {
    email: {
        none: "please fill in your email",
        invalid: "invalid email"
    },
    password: {
        none: "please fill in your password",
        noNum: "password must contain at least one number, ",
        noLowerCase: "password must contain at least one lowercase character, ",
        noUpperCase: "password must contain at least one uppercase character, ",
        tooShort: "password must contain at least 8 characters, ",
        tooLong: "password must contain no more than 60 characters, ",
        nonStandard: "password may only contain alphanumeric characters, "
    }

};

class LoginDashboard extends React.Component {

    // BASELINE REACT //////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(props) {
        super(props);
        this.state = {
            userExists: false,

            emailInvalidMessage: msg.email.none,
            passwordInvalidMessage: msg.password.none
        }
    }

    render() {
        if (!this.props.show) {
            return (
                <Form id={"userForm"} onSubmit={this.handleFormSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control onChange={this.validateEmail} id={"email"} type="email"
                                      placeholder="Enter email"/>
                        <Form.Text className="text-muted">
                            Email is not shared and only used for account recovery purposes
                            <br/>
                            If you don't care about that, just make something up - we don't send validation emails
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={this.validatePassword} id={"password"} type="password"
                                      placeholder="Password"/>
                    </Form.Group>

                    {this.confirmPasswordField()}
                    {this.aliasField()}

                    <div className="d-flex flex-column">
                        <LogInButton
                            userExists={this.state.userExists}
                            emailInvalidMessage={this.state.emailInvalidMessage}
                            passwordInvalidMessage={this.state.passwordInvalidMessage}
                            onClick={this.handleFormSubmit}
                        />
                    </div>

                </Form>
            )
        } else {
            return null;
        }
    };


    validateEmail = (event) => {
        let message = '';
        let email = event.target.value;


        console.log("check EMAIL");
        if (email !== '') {
            fetch(`${API_ADDRESS}users/validate/email?email=${email}`)
                .then(response => response.text())
                .then(text => this.setState({
                    userExists: text === 'success',
                }));

            if (email.indexOf("@") < 1 || email.length <= email.indexOf("@") + 1) {
                message = msg.email.invalid;
            }
        } else {
            message = msg.email.none;
        }

        this.setState({
            emailInvalidMessage: message
        })
    };

    validatePassword = (event) => {
        let password = event.target.value;
        let message = "";

        if (password === "") {
            message = msg.password.none;
        } else {
            if (/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                message += msg.password.nonStandard;
            }
            if (!/[a-z]/.test(password)) {
                message += msg.password.noLowerCase;
            }
            if (!/[A-Z]/.test(password)) {
                message += msg.password.noUpperCase;
            }
            if (password.length < 8) {
                message += msg.password.tooShort;
            }
            if (password.length > 60) {
                message += msg.password.tooShort;
            }
            if (!/\d/.test(password)) {
                message += msg.password.noNum;
            }
        }

        this.setState({
            passwordInvalidMessage: message
        })
    };

    // AFTER SUBMIT ////////////////////////////////////////////////////////////////////////////////////////////////////
    handleFormSubmit = () => {
        console.log("handling login . . . ");
        if (this.state.isExpanded && !this.state.userExists) {
            this.serverPostCreateNewUser();
        } else if (!this.state.isExpanded && this.state.userExists) {
            this.serverPostLogIn();
        } else {
            this.setState({
                isExpanded: !this.state.userExists
            })
        }
    };

    serverPostLogIn() {
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
                    this.props.onLogin();
                }
            });
    }

    serverPostCreateNewUser() {
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
            .then(() => this.serverPostLogIn());
    }
}

export default LoginDashboard;