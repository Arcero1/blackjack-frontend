import React from 'react';
import {
    Accordion,
    Card,
    Row,
    Col,
} from 'react-bootstrap';

import LoginDashboard from "./dashboards/login/LoginDashboard"
import AccountDashboard from "./dashboards/account/AccountDashboard";
import LeaderBoard from "./dashboards/leaderboard/LeaderBoard";
import ProfileDashboard from "./dashboards/profile/ProfileDashboard";

class DashboardPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: localStorage.getItem("userName"),
            alias: ""
        };
    }

    profileTag = () => {
        return (
            <Row>
                <Col sm="7">
                    {sessionStorage.getItem("profileName") ? sessionStorage.getItem("profileName") : "profile"}
                </Col>
            </Row>
        )
    };

    leftPanel = () => {
        return (
            <Col>
                <Row>
                    {this.state.loggedIn ?
                        <AccountDashboard
                            onLogout={() => this.setState({loggedIn: false})}
                            show={this.state.loggedIn}
                            passAlias={this.getAlias}
                        />
                        :
                        <LoginDashboard
                            onLogin={() => this.setState({loggedIn: true})}
                            show={this.state.loggedIn}
                        />
                    }
                </Row>
                <Row>
                    <ProfileDashboard
                        refresh={() => this.setState({})}
                        show={this.state.loggedIn}
                    />
                </Row>

            </Col>
        )
    };

    dashboardPanelBody = () => {
        return (
            <Card.Body className={"info-panel-body"}>
                <Row>
                    {this.leftPanel()}
                    <Col>
                        <LeaderBoard
                            alias={this.state.alias}/>
                    </Col>
                </Row>
            </Card.Body>
        )
    };

    getAlias = (alias) => {
        this.setState({
            alias: alias
        })
    };

    render() {
        return (
            <Accordion>
                <Card>

                    <Accordion.Toggle className={"info-panel-button"} as={Card.Header} eventKey="0">
                        {this.profileTag()}
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="0">
                        {this.dashboardPanelBody()}
                    </Accordion.Collapse>

                </Card>
            </Accordion>
        )
    }
    ;
}

export default DashboardPanel;

