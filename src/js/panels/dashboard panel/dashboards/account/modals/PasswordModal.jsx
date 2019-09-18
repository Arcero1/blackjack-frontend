import React from "react";
import {
    Button,
    Form,
    Modal,
} from "react-bootstrap";
import {API_ADDRESS} from "../../../../../constants";

class PasswordModal extends React.Component {

    // BASELINE REACT //////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(props) {
        super(props);
        this.state = {
            incorrectPassword: false
        }
    }

    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        confirm password
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this.submitDelete}>

                        <Form.Group>
                            <Form.Control
                                className={this.state.incorrectPassword ? "wrong-pass" : ""}
                                name={"password"}
                                id={"password-modal"}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Button variant={"danger"} onClick={this.submitDelete} block>
                                Delete
                            </Button>
                        </Form.Group>

                    </Form>
                </Modal.Body>
            </Modal>
        );
    }

    submitDelete = (event) => {
        event.preventDefault();
        console.log("USER : " + localStorage.getItem("userName"))
        fetch(`${API_ADDRESS}users/delete`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: localStorage.getItem("userName"),
                password: document.getElementById("password-modal").value
            })
        })
            .then(response => response.text())
            .then(text => {
                console.log("server to DELETE PROFILE : " + text);
                if (text === "success") {
                    localStorage.removeItem("userName");
                    sessionStorage.removeItem("profileName");
                    this.props.onDelete();
                } else {
                    this.setState({
                        incorrectPassword: true
                    })
                }
            });
    };
}

export default PasswordModal;

