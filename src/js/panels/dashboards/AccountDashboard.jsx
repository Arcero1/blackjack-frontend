import React, {Component} from "react";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import {API_ADDRESS} from "../../address";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Nav from "react-bootstrap/Nav";

class LoginDashboard extends Component {

    render() {
        if (this.props.show) {
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
        } else {
            return null;
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
}

export default LoginDashboard;