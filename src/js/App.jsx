import React, {Component} from 'react';

import '../css/App.css';
import DashboardPanel from "./panels/DashboardPanel";
import ControlPanel from "./panels/ControlPanel";
import CardPanel from "./panels/CardPanel";

import BetPanel from "./panels/BetPanel";
import ProfileDashboard from "./panels/dashboards/ProfileDashboard";

import {Modal, Button} from "react-bootstrap";
import {API_ADDRESS} from "./address";

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
            showBetPanel: false,

            gameIsFinished: false,
            playerIsBust: false,
            playerHasWon: false,
            showProfilePrompt: false,
            showDealerHoleCard: false,
            endMessage: '',
            disableControls: true
        };


        if (sessionStorage.getItem('profileName')) {
            this.serverStartSession();
            this.serverGetCredits();
        }
    }

    render() {

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
                    showDealerHoleCard={this.state.showDealerHoleCard}
                />

                <BetPanel
                    activeProfileCredits={this.state.activeProfileCredits}
                    showBetPanel={this.state.showBetPanel}
                    startGame={this.startGame}
                />

                <ControlPanel
                    disableControls={this.state.disableControls}
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

    // SESSION CONTROL /////////////////////////////////////////////////////////////////////////////////////////////////
    serverStartSession = () => {
        fetch(`${API_ADDRESS}game/start?profileName=${sessionStorage.getItem('profileName')}`)
            .then(response => response.text())
            .then(text => {
                console.log('response to START SESSION : ' + text);
            });
    };


    // GAME CONTROL ////////////////////////////////////////////////////////////////////////////////////////////////////
    startGame = (bet) => {
        if (sessionStorage.getItem('profileName')) {
            this.serverSendBet(bet)
                .then(() => {
                    this.serverStartGame()
                        .then(() => {
                            this.dealerHit();
                            this.dealerHit();
                            this.hit();
                            this.hit();
                        })
                })
                .then(() => {
                    this.setState({
                        showBetPanel: true,
                        disableControls: false
                    });
                })
        } else {
            this.setState({showProfilePrompt: true});
        }

    };

    hit = () => {

        fetch(`${API_ADDRESS}game/hit`)
            .then(response => response.text())
            .then(card => {
                console.log('server to HIT : ' + card);
                this.setState({
                    cards: this.state.cards.concat(card),
                });
                this.checkIfPlayerIsBust();
            });
    };

    dealerHit = () => {

        fetch(`${API_ADDRESS}game/dealer/hit`)
            .then(response => response.text())
            .then(card => {
                console.log('server to DEALER HIT : ' + card);
                this.setState({
                    dealerCards: this.state.dealerCards.concat(card),
                });
            });
    };

    stand = () => {
        this.setState({
            disableControls: true,
            showDealerHoleCard: true
        });

        fetch(`${API_ADDRESS}game/stand`)
            .then(response => response.text())
            .then(text => {
                console.log('server to STAND : ' + text);
                if (text === "win") {
                    this.setState({
                        endMessage: "you win"
                    })
                } else {
                    this.setState({
                        endMessage: "you lose"
                    })
                }
                this.serverGetCredits();
            });

        setTimeout(() => {
            this.setState({
                gameIsFinished: true
            })

        }, 1000);
    };

    // GAME CHECKS /////////////////////////////////////////////////////////////////////////////////////////////////////
    checkIfPlayerIsBust = () => {
        fetch(`${API_ADDRESS}game/pollBust`)
            .then(response => response.text())
            .then(text => {
                console.log('server to BUST CHECK : ' + text);
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

        return fetch(`${API_ADDRESS}game/start?profileName=${sessionStorage.getItem('profileName')}`)
            .then(response => response.text())
            .then(text => {
                console.log('server to START : ' + text);
                return text;
            });
    };

    serverSendBet = (bet) => {
        return (
            fetch(`${API_ADDRESS}game/bet?betAmount=${bet}`)
                .then(response => response.text())
                .then(text => {
                    console.log('server to BET : ' + text);
                    return text === 'success';
                }));
    };

    serverGetCredits = () => {

        fetch(`${API_ADDRESS}profiles/credits?name=${sessionStorage.getItem("profileName")}`)
            .then(response => response.text())
            .then(text => {
                console.log(`server to GET CREDITS : ${text}`);
                if (!text.includes("failure") && text !== this.state.activeProfileCredits) {
                    this.setState({activeProfileCredits: text})
                }
            })
    };

    // UTILITY FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////////////////
    resetGame = () => {


        this.setState({
            gameIsFinished: false,
            showDealerHoleCard: false,

            cards: [],
            dealerCards: [],
            betValue: 0,

            // flags
            showBetPanel: false
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
