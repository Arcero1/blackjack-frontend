import React from "react";
import {
  Button,
  Row,
  Col,
  ButtonGroup,
  Nav
} from "react-bootstrap";

import {customGET, customPOST} from "../../../../util/server";
import PasswordModal from "./modals/PasswordModal";
import Form from "react-bootstrap/Form";
import {STORAGE} from "../../../../util/constants";

class LoginDashboard extends React.Component {
  controller = "users";

  constructor(props) {
    super(props);
    this.state = {
      alias: "",
      gamesWon: 0,
      gamesPlayed: 0,
      showDeleteModal: false
    };
    this.getUserInfo()
  }

  render() {

    if (this.props.show) {
      return (
        <div>
          <PasswordModal
            show={this.state.showDeleteModal}
            onHide={() => this.setState({showDeleteModal: false})}
            onDelete={this.handleLogout}
          />

          <Row>
            <Col sm={"8"}>
              <Form
                onSubmit={this.serverUpdateAlias}>
                <Form.Group>
                  <Form.Control
                    id={"alias"}
                    className={"user-alias"}
                    defaultValue={this.state.alias}
                    plaintext/>
                </Form.Group>
              </Form>
            </Col>

            <Col>

              <ButtonGroup className={"stats"}>
                <Button variant="outline-primary">statistics</Button>
                <Button variant="primary">{this.state.gamesPlayed}P</Button>
                <Button variant="success">{this.state.gamesWon}W</Button>
                <Button variant="danger">{this.state.gamesPlayed - this.state.gamesWon}L</Button>
              </ButtonGroup>
            </Col>
          </Row>

          <Row>
            <Nav
              className={"mt-4"}
              onSelect={(selectedKey) => {
                if (selectedKey === "logout") {
                  this.handleLogout();
                } else if (selectedKey === "delete-account") {
                  this.setState({
                    showDeleteModal: true
                  })
                } else if (selectedKey === "change.pass") {

                }
              }}
            >
              <Nav.Item className={"ml-4"}>
                <Nav.Link eventKey="logout">LogOut</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className={"red-text"} eventKey="delete-account">Delete</Nav.Link>
              </Nav.Item>
            </Nav>
          </Row>
        </div>
      )
    } else {
      return null;
    }
  };

  serverUpdateAlias = (event) => {
    event.preventDefault();
    customPOST(
      this.controller,
      "setAlias",
      JSON.stringify({
        email: localStorage.getItem("userName"),
        password: "pass", //the password doesn't matter here
        alias: document.getElementById("alias").value
      })
    )
      .then(() => this.getUserInfo());
  };

  handleLogout = () => {
    localStorage.removeItem("userName");
    sessionStorage.removeItem("profileName");
    this.props.onLogout();
  };

  getUserInfo = () => {
    if (!STORAGE.userName.getValue()) return;
    console.log("USERNAME: ", STORAGE.userName.getValue());

    customGET(
      "users",
      "info",
      ["email"],
      [STORAGE.userName.getValue()]
    )
      .then(response => response.message)
      .then(json => {
        if (json.alias !== this.state.alias || json.gamesPlayed !== this.state.gamesPlayed) {
          this.setState({
            alias: json.alias,
            gamesPlayed: json.gamesPlayed,
            gamesWon: json.gamesWon
          });

          this.props.passAlias(this.state.alias)
        }
      })
  }

}

export default LoginDashboard;