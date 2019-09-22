import React, {Component} from 'react';

import '../css/App.css';
import DashboardPanel from "./panels/dashboard panel/DashboardPanel";
import ControlPanel from "./panels/control panel/ControlPanel";
import CardPanel from "./panels/card panel/CardPanel";
import BetPanel from "./panels/bet panel/BetPanel";
import ProfileModal from "./modals/ProfileModal";

import {API_ADDRESS, basicGET, customGET} from "./util/server";
import EndDialogueModal from "./modals/EndDialogueModal";
import {STORAGE} from "./util/constants";

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
            showBetPanel: true,
            showProfilePrompt: false,
            showDealerHoleCard: false,

            gameIsFinished: false,
            playerIsBust: false,
            playerHasWon: false,
            endMessage: "",
            disableControls: true
        };

        if (STORAGE.profileName.getValue()) {
            this.serverGetCredits();
        }
    }

    render() {
        this.serverGetCredits();
        return (
            <div className="App">
                <DashboardPanel
                    refresh={() => this.setState({})}
                />
                <ProfileModal
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
                    show={this.state.showBetPanel}
                    startGame={this.startGame}
                />

                <ControlPanel
                    disableControls={this.state.disableControls}
                    hit={() => this.hit().then(this.checkIfPlayerIsBust())}
                    stand={this.stand}
                />

                <EndDialogueModal
                    show={this.state.gameIsFinished}
                    onHide={this.resetGame}
                    message={this.state.endMessage}
                    credits={this.state.activeProfileCredits}
                    type={'danger'}
                />
            </div>
        );
    }

    // GAME CONTROL ////////////////////////////////////////////////////////////////////////////////////////////////////
    startGame = (bet) => {

        basicGET(
            "game",
            "start",
            ["profileName"],
            [STORAGE.profileName.getValue()]
        )
            .then(success => {
                if (!success) return;

                console.log(bet);
                return basicGET(
                    "game",
                    "bet",
                    ["betAmount"],
                    [bet]
                )
                    .then(() => {
                        this.dealerHit();
                        this.dealerHit();
                        this.hit();
                        this.hit();
                    })
            })
            .then(() => {
                this.setState({
                    showBetPanel: false,
                    disableControls: false
                });
            })
    };

    hit = () => {
        return customGET(
            "game",
            "hit"
        )
            .then(response => {
                return response.status === "SUCCESS" ? response.message : null;
            })
            .then(card => {
                if (!card) return;

                this.setState({cards: this.state.cards.concat(card)});
            });
    };

    dealerHit = () => {

        customGET(
            "game",
            "dealer/hit"
        )
            .then(response => {
                return response.status === "SUCCESS" ? response.message : null;
            })
            .then(card => {
                if (!card) return;

                this.setState({dealerCards: this.state.dealerCards.concat(card)});
            });
    };

    stand = () => {
        this.setState({
            disableControls: true,
            showDealerHoleCard: true
        });

        customGET(
            "game",
            "stand"
        )
            .then(response => response.status === "SUCCESS" ? response.message : null)
            .then(result => {
                this.setState({endMessage: `you ${result}`});
                this.serverGetCredits();
            });

        setTimeout(() => {
            this.setState({gameIsFinished: true})
        }, 1000);
    };

    // GAME CHECKS /////////////////////////////////////////////////////////////////////////////////////////////////////
    checkIfPlayerIsBust = () => {
        customGET(
            "game",
            "pollBust"
        )
            .then(response => response.message)
            .then(text => {
                if (text === "bust") {
                    this.stand();
                    this.setState({
                        gameIsFinished: true,
                        playerIsBust: true,
                    })
                }
            });
    };

    serverGetCredits = () => {
        let profileName = STORAGE.profileName.getValue();
        if (profileName) {
            customGET(
                "profiles",
                "credits",
                ["name"],
                [profileName]
            )
                .then(response => {
                    if (response.message !== this.state.activeProfileCredits)
                        this.setState({activeProfileCredits: response.message});
                })
        }
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
            showBetPanel: true
        });
    };
}


export default App;
