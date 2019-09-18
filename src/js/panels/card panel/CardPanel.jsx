import React from "react";
import {Col, Container, Image, Row} from "react-bootstrap";

class CardPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Container>

                <Row>
                    {this.props.dealerCardArray
                        .map((card, index) => {
                            if (this.props.showDealerHoleCard) {
                                return CardPanel.getCardImagePath(card);
                            }
                            return index === 1 ? CardPanel.getCardImagePath("hole") : CardPanel.getCardImagePath(card);
                        })
                        .map((card, index) => (
                            <Col>
                                <Image src={card} style={{left: `${index * 10}vw`}} className={"dealer-card"} fluid/>
                            </Col>
                        ))}
                </Row>

                <Row className={"card-panel"}>
                    {this.props.cardArray
                        .map((card) => CardPanel.getCardImagePath(card))
                        .map((card, index) => (
                            <Col>
                                <Image src={card} style={{left: `${index * 10}vw`}} className={"playing-card"} fluid/>
                            </Col>
                        ))}
                </Row>

            </Container>
        );
    }

    static getCardImagePath(name) {
        return `cards/${name}.png`;
    }
}

export default CardPanel;