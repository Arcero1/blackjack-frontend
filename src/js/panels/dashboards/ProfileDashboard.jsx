import {Alert, Button, Col, Form, Modal, Row} from "react-bootstrap";
import React, {Component} from "react";
import {API_ADDRESS} from "../../address";

class ProfileDashboard extends Component {

    // BASELINE REACT //////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(props) {
        super(props);
        this.state = {
            canSubmit: false
        };
    }

    render() {
        let inputBoxColor = this.props.canSubmit ? 'success' : 'danger';
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        please choose a name
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Col sm="12">
                                <Alert variant={inputBoxColor}>
                                    <Form.Control name={"nameField"} id={"afield"} onChange={this.handleProfilePromptChange} plaintext/>
                                </Alert>
                            </Col>
                        </Form.Group>
                        <Button onClick={this.submitProfileName} disabled={!this.state.canSubmit} block>Submit</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        );
    }

    submitProfileName = (event) => {
        event.preventDefault();
        let boundUser = localStorage.getItem("userName") ? localStorage.getItem("userName") : "root";
        let profileName = document.getElementById('afield').value;
        fetch(`${API_ADDRESS}profiles/create?name=${profileName}&userName=${boundUser}`)
            .then(response => response.text())
            .then(text => {
                console.log('server to SUBMIT PROFILE : ' + text);
                if(text === "success") {
                    sessionStorage.setItem('profileName', profileName);
                }
                this.props.onHide();
            });
    };

    handleProfilePromptChange = (event) => {
        console.log(event.target.value);
        if (event.target.value !== "") {
            fetch(`${API_ADDRESS}profiles/validate?name=${event.target.value}`)
                .then(response => response.text())
                .then(text => {
                    console.log('server to VALIDATE PROFILE : ' + text);
                    let condition = text !== 'success';
                    if(this.state.canSubmit !== condition) { // prevent unnecessary re-renders
                        this.setState({
                            canSubmit: condition
                        })
                    }
                });
        } else {
            if(this.state.canSubmit) { // prevent unnecessary re-renders
                this.setState({
                    canSubmit: false
                })
            }
        }
    };


}

export default ProfileDashboard;

