import React from "react";
import {Col, ListGroup, Row} from "react-bootstrap";
import {API_ADDRESS, customGET} from "../../../../util/server";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import ProfileModal from "../../../../modals/ProfileModal";

export default class ProfileDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: localStorage.getItem("userName"),
            leaderBoardItems: [],
            showProfilePrompt: false
        };
        this.getUserProfiles();
    }

    getUserProfiles = () => {
        customGET(
            "profiles",
            "myProfiles",
            ["email"],
            [localStorage.getItem("userName")]
        )
            .then(response => response.json())
            .then(response => this.setState({leaderBoardItems: response}))
    };

    render() {
        if (this.state.userName !== localStorage.getItem("userName")) {
            this.getUserProfiles();
        }

        return (
            <Container>
                <ProfileModal
                    show={this.state.showProfilePrompt}
                    onHide={() => {
                        this.setState({
                            showProfilePrompt: false
                        });
                        this.getUserProfiles();
                    }} // to suppress error messages
                />


                <ListGroup variant={"flush"}>
                    {this.state.leaderBoardItems.map(item =>
                        <ProfileTag
                            name={item.name}
                            credits={item.credits}
                            refresh={() => {
                                this.getUserProfiles();
                                this.props.refresh();
                            }}
                        />)}
                </ListGroup>
                <Button onClick={() => this.setState({
                    showProfilePrompt: true
                })} variant={"outline-primary"} className={"mt-2"} block>
                    new
                </Button>
            </Container>
        )
    }
}

function ProfileTag(props) {
    return (

        <ListGroup.Item id={`prof-${props.name}`}>
            <Row>

                <Col sm={"3"} xs={"6"} className={"mt-1 profile-dashboard-name"}>
                    {props.name.toUpperCase()}
                </Col>

                <Col sm={"3"} xs={"6"} className={"mt-1 profile-dashboard-credits"}>
                    ♣ {props.credits}
                </Col>

                <Col sm={{span: "3", offset: "3"}}>
                    <div className="d-flex flex-column">
                        <ButtonGroup>
                            <Button
                                onClick={() =>{
                                    sessionStorage.setItem("profileName", props.name);
                                    props.refresh();}
                                }
                                variant={"outline-success"} size={"sm"}>
                                select
                            </Button>
                            <Button
                                onClick={() => {
                                    customGET(
                                        "profiles",
                                        "delete",
                                        ["name"],
                                        [props.name]
                                    )
                                        .then(() => props.refresh())
                                }}
                                variant={"danger"}
                                size={"sm"}>
                                x
                            </Button>
                        </ButtonGroup>
                    </div>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}