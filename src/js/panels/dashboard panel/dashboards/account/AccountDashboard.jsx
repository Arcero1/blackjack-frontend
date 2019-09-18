import React from "react";
import {
    Button,
    Row,
    Col,
    ButtonGroup,
    Nav
} from "react-bootstrap";

import {API_ADDRESS} from "../../../../address";

class LoginDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alias: "",
            gamesWon: 0,
            gamesPlayed: 0
        }
    }

    render() {
        this.getUserInfo();

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
        this.props.onLogout();
    };

    deleteAccount = () => {

    };

    getUserInfo = () => {
        fetch(`${API_ADDRESS}users/info?email=${localStorage.getItem('userName')}`)
            .then(response => response.json())
            .then(json => {
                console.log("server to USER INFO : ");
                console.log(json);

                if(json.alias !== this.state.alias || json.gamesPlayed !== this.state.gamesPlayed) {
                    this.setState({
                        alias: json.alias,
                        gamesPlayed: json.gamesPlayed,
                        gamesWon: json.gamesWon
                    })
                }
            })
    };
}

export default LoginDashboard;