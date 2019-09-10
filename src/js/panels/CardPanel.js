import React, {Component} from 'react';
import {Col, Container, Image, Row} from "react-bootstrap";

class CardPanel extends Component {
  constructor(props) {
    super(props)
    console.log("creating card panel . . . ");
  }

  render() {
    let cardPos = this.props.cardArray.length * 10;
    console.log(cardPos);

    return (
      <Container>
        <Row>
          {this.props.dealerCardArray
              .map((card, index) => {
                  if(this.props.playerHasFinished) {
                      return this.getCardImagePath(card);
                  }
                  return index === 1 ? this.getCardImagePath("hole") : this.getCardImagePath(card);
              })
              .map((card, index) => (
                  <Col>
                    <Image src={card} style={{left: index * 10 + 'vw'}} className={'dealer-card'} fluid/>
                  </Col>
              ))}
        </Row>
        <Row className={'card-panel'}>
          {this.props.cardArray
            .map((card) => this.getCardImagePath(card))
            .map((card, index) => (
            <Col>
              <Image src={card} style={{left: index * 10 + 'vw'}} className={'playing-card'} fluid/>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }


  getCardImagePath(_name) {
    let path = 'cards/' + _name + '.png';
    return path;
  };
}

export default CardPanel;