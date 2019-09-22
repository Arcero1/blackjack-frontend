import React from "react";
import {
    Col,
    ListGroup,
    Row
} from "react-bootstrap";

import {API_ADDRESS, customGET} from "../../../../util/server";

class LeaderBoard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            leaderBoardItems: [],
            seconds: 0
        };

        this.serverGetLeaderBoard();
    }

    render() {

        return (
            <Col>
                <h1>Leaderboard</h1>
                <ListGroup>
                    {this.state.leaderBoardItems.map((item, index) =>
                        <ListGroup.Item variant={item.owner === this.props.alias ? "success" : "light"} key={index}>
                            <Row>
                                <Col sm="7">
                                    {item.name.toUpperCase()}
                                </Col>
                                <Col>
                                    ♣ {item.credits}
                                </Col>
                            </Row>

                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Col>
        )
    }

    serverGetLeaderBoard = () => {
        customGET(
            "profiles",
            "leaderboard",
            )
            .then(response => response.message)
            .then(leaders => {
                if (this.state.leaderBoardItems !== leaders) {
                    this.setState({
                        leaderBoardItems: leaders
                    })
                }
            })
    };

    componentDidMount() {
        // leaderboard updates every minute
        this.interval = setInterval(() => this.serverGetLeaderBoard(), 15000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
}

export default LeaderBoard