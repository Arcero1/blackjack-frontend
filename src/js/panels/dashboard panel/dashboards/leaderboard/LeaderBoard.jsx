import React from "react";
import {
    Col,
    ListGroup,
    Row
} from "react-bootstrap";

import {API_ADDRESS} from "../../../../constants";

class LeaderBoard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            leaderBoardItems: []
        }
    }

    render() {
        this.serverGetLeaderBoard();

        return (
            <Col sm="5">
                <h1>Leaderboard</h1>
                <ListGroup>
                    {this.state.leaderBoardItems.map((item, index) => {
                        return (
                            <ListGroup.Item key={index}>
                                <Row>
                                    <Col sm="7">
                                        {item.name.toUpperCase()}
                                    </Col>
                                    <Col>
                                        ♣ {item.credits}
                                    </Col>
                                </Row>

                            </ListGroup.Item>)
                    })}
                </ListGroup>
            </Col>
        )
    }

    serverGetLeaderBoard = () => {
        fetch(`${API_ADDRESS}/profiles/leaderboard`)
            .then(leaders => leaders.json())
            .then(leaders => {
                if(this.state.leaderBoardItems !== leaders) {
                    this.setState({
                        leaderBoardItems: leaders
                    })
                }
            })
    };
}

export default LeaderBoard