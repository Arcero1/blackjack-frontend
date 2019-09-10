import React, {Component} from 'react';

import '../css/App.css';
import DashboardPanel from "./panels/DashboardPanel";
import ControlPanel from "./panels/ControlPanel";
import CardPanel from "./panels/CardPanel";

import BetPanel from "./panels/BetPanel";
import ProfileDashboard from "./panels/dashboards/ProfileDashboard";

import {Modal, Button} from "react-bootstrap";
import {API_ADDRESS} from "./address";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class App extends Component {

    // BASELINE REACT //////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(props) {
        super(props);
        this.state = {
            // assets
            cards: [],
            dealerCards: [],
            activeProfileCredits: 0,

            // flags
            gameIsActive: false,
            gameIsFinished: false,
            playerIsBust: false,
            playerHasWon: false,
            showProfilePrompt: false,
            playerHasFinished: false,
            endMessage: ''
        };


        if (sessionStorage.getItem('profileName')) {
            this.serverStartSession();
            this.serverGetCredits();
        }
    }

    render() {
        this.getEndMessage();
        console.log(this.state.endMessage);
        this.serverGetCredits();
        return (
            <div className="App">
                <DashboardPanel/>
                <ProfileDashboard
                    show={this.state.showProfilePrompt}
                    onHide={() => {
                        this.setState({
                            showProfilePrompt: false
                        })
                    }} // to suppress error messages
                />

                <CardPanel
                    cardArray={this.state.cards}
                    dealerCardArray={this.state.dealerCards}
                    playerHasFinished={this.state.playerHasFinished}
                />

                <BetPanel
                    activeProfileCredits={this.state.activeProfileCredits}
                    gameIsActive={this.state.gameIsActive}
                    startGame={this.startGame}
                />

                <ControlPanel
                    gameIsActive={this.state.gameIsActive}
                    gameIsFinished={this.state.gameIsFinished}
                    hit={this.hit}
                    stand={this.stand}
                />

                <EndDialogue
                    show={this.state.gameIsFinished}
                    onHide={this.resetGame}
                    message={this.state.endMessage}
                    credits={this.state.activeProfileCredits}
                    type={'danger'}
                />
            </div>
        );
    }

    getEndMessage = () => {

        console.log("preparing finish message " + this.state.playerHasWon ? "success" : "failure")
        let message = '';

        if (!this.state.playerHasWon) {
            if (this.state.playerIsBust) {
                message = "you are bust, \n"
            }
            message += "you lose";

        } else {
            message = "you win";
        }

        if(this.state.endMessage !== message) {
            this.setState({
                endMessage: message
            })
        }
    };

    // SESSION CONTROL /////////////////////////////////////////////////////////////////////////////////////////////////
    serverStartSession = () => {
        console.log('Requesting session ID . . . ');
        fetch(`${API_ADDRESS}game/start?profileName=${sessionStorage.getItem('profileName')}`)
            .then(response => response.text())
            .then(text => {
                console.log('Server Response : ' + text);
            });
    };


    // GAME CONTROL ////////////////////////////////////////////////////////////////////////////////////////////////////
    startGame = (bet) => {
        if (sessionStorage.getItem('profileName')) {
            this.serverSendBet(bet)
                .then(() => {
                    this.serverStartGame();
                    this.dealerHit();
                    this.dealerHit();
                    this.hit();
                    this.hit();
                })
                .then(() => {
                    this.setState({gameIsActive: true});
                })
        } else {
            this.setState({showProfilePrompt: true});
        }

    };

    hit = () => {
        console.log("request ID: hit");

        fetch(`${API_ADDRESS}game/hit`)
            .then(response => response.text())
            .then(card => {
                console.log('hit requestRESPONSE : ' + card);
                this.setState({
                    cards: this.state.cards.concat(card),
                });
                this.checkIfPlayerIsBust();
            });
    };

    dealerHit = () => {
        console.log("requestID: dealer_hit");

        fetch(`${API_ADDRESS}game/dealer/hit`)
            .then(response => response.text())
            .then(card => {
                console.log('dealer_hit requestRESPONSE : ' + card);
                this.setState({
                    dealerCards: this.state.dealerCards.concat(card),
                });
                console.log("next dealer card : ", this.state.cards);
            });
    };

    stand = () => {
        console.log('requestID: stand');
        this.setState({
            playerHasFinished: true
        });
        setTimeout(() => {

            fetch(`${API_ADDRESS}game/stand`)
                .then(response => response.text())
                .then(text => {
                    console.log('stand requestRESPONSE : ' + text);
                    if (text === "win") {
                        this.setState({
                            gameIsFinished: true,
                            playerHasWon: true,
                        })
                    } else {
                        this.setState({
                            gameIsFinished: true,
                            playerHasWon: false
                        })
                    }

                });

        }, 1000);
    };

    // GAME CHECKS /////////////////////////////////////////////////////////////////////////////////////////////////////
    checkIfPlayerIsBust = () => {
        console.log("requestID: bust_check");
        fetch(`${API_ADDRESS}game/pollBust`)
            .then(response => response.text())
            .then(text => {
                console.log('bust_check requestRESPONSE : ' + text);
                if (text === "bust") {
                    this.stand();
                    this.setState({
                        gameIsFinished: true,
                        playerIsBust: true,
                    })
                }
            });
    };


    // SERVER REQUESTS /////////////////////////////////////////////////////////////////////////////////////////////////
    serverStartGame = () => {
        console.log('sending request');

        fetch(`${API_ADDRESS}game/start?profileName=${sessionStorage.getItem('profileName')}`)
            .then(response => response.text())
            .then(text => {
                console.log('Server Response : ' + text);
            });
    };

    serverSendBet = (bet) => {
        console.log("requestID: set_bet");
        return (
            fetch(`${API_ADDRESS}game/bet?betAmount=${bet}`)
                .then(response => response.text())
                .then(text => {
                    console.log('requestRESPONSE : ' + text);
                    return text === 'success';
                }));
    };

    serverGetCredits = () => {
        console.log("fetching credits . . .");

        fetch(`${API_ADDRESS}profiles/credits?name=${sessionStorage.getItem('profileName')}`)
            .then(response => response.text())
            .then(text => {
                console.log('Server Response : ' + text);
                if (text !== this.state.activeProfileCredits) {
                    this.setState({activeProfileCredits: text})
                }
            })
    };

    // UTILITY FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////////////////
    resetGame = () => {
        this.setState({
            cards: [],
            dealerCards: [],
            activeProfileCredits: 0,
            betValue: 0,

            // flags
            gameIsActive: false,
            gameIsFinished: false,
            playerIsBust: false,
            playerHasFinished: false,
            playerHasWon: false
        });
    };
}

function EndDialogue(props) {
    return (

        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName={"modal-end"}
            centered
        >


            <Modal.Body>
                <Modal.Title className={"modal-end-header"}>
                    {props.message}
                </Modal.Title>
                <p>
                    Your Credits: {props.credits}
                </p>
                <Button variant="dark" onClick={props.onHide} block>
                    New Game
                </Button>
            </Modal.Body>
        </Modal>
    );
}

export default App;
