import React from "react";
import {
  Form
} from "react-bootstrap";

import {basicGET, basicPOST} from "../../../../util/server";
import LogInButton from "./buttons/LogInButton";
import {STORAGE} from "../../../../util/constants";

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
            <Form.Control onChange={this.validateNewPassword} id={"password"} type="password"
                          placeholder="Password"/>
          </Form.Group>

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
    let message = "";
    let email = event.target.value;

    if (email === "") {
      this.setState({
        emailInvalidMessage: msg.email.none
      });
      return;
    }

    basicGET(
      "users",
      "validate/email",
      ["email"],
      [email]
    )
      .then(success => {
        this.setState({userExists: success})
      });

    if (email.indexOf("@") < 1 || email.length <= email.indexOf("@") + 1) {
      message = msg.email.invalid;
    }

    this.setState({
      emailInvalidMessage: message
    })
  };

  validateNewPassword = (event) => {
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
    if (!this.state.userExists) {
      this.serverPostCreateNewUser();
    } else {
      this.serverPostLogIn();
    }
  };

  validateExistingPassword = () => {
    basicPOST(
      "users",
      "validate/password",
      JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      })
    )
      .then(success => {
        if (success) {
          STORAGE.userName.setValue(document.getElementById("email").value);
          this.props.onLogin();
        }
      })
  };

  serverPostLogIn() {
    if (this.validateExistingPassword()) {
      console.log("OOOOOO")
    }
  }

  serverPostCreateNewUser() {
    basicPOST(
      "users",
      "create",
      JSON.stringify({
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      })
    )
      .then(boolResponse => boolResponse ? this.serverPostLogIn() : null);
  }
}

export default LoginDashboard;