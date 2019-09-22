import React from "react";
import {
    Col,
    ListGroup,
    Row,
    Button,
    ButtonGroup,
    Container
} from "react-bootstrap";


import {customGET} from "../../../../util/server";
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
            .then(response => this.setState({leaderBoardItems: response.message}))
    };

    render() {
        return (
            this.props.show ?
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
                    <ListGroup.Item>
                        my profiles
                    </ListGroup.Item>
                    {Array.isArray(this.state.leaderBoardItems) ?
                        this.state.leaderBoardItems.map(item =>
                            <ProfileTag
                                name={item.name}
                                credits={item.credits}
                                refresh={() => {
                                    this.getUserProfiles();
                                    this.props.refresh();
                                }}
                            />) : null}
                </ListGroup>
                <Button onClick={() => this.setState({
                    showProfilePrompt: true
                })} variant={"outline-dark"} className={"mt-2"} block>
                    new
                </Button>
            </Container>
                : null
        )
    }
}

function ProfileTag(props) {
        return (
            <ListGroup.Item
                className={props.name === sessionStorage.getItem("profileName") ? "my-prof-active" : ""}
                id={`prof-${props.name}`}>
                <Row>

                    <Col sm={"6"} xs={"6"} className={"mt-1 profile-dashboard-name"}>
                        {props.name.toUpperCase()}
                    </Col>

                    <Col sm={"3"} xs={"6"} className={"mt-1 profile-dashboard-credits"}>
                        ♣ {props.credits}
                    </Col>

                    <Col sm={"3"}>
                        <div className="d-flex flex-column">
                            <ButtonGroup>
                                <Button
                                    onClick={() => {
                                        sessionStorage.setItem("profileName", props.name);
                                        props.refresh();
                                    }
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
                                            .then(() => sessionStorage.removeItem("profileName"))
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