import React from "react";
import {
    Button,
    Form,
    Modal,
} from "react-bootstrap";
import {API_ADDRESS, basicPOST} from "../../../../../util/server";
import {STORAGE} from "../../../../../util/constants";

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

        basicPOST(
            "users",
            "delete",
            JSON.stringify({
                email: STORAGE.userName.getValue(),
                password: document.getElementById("password-modal").value
            })
        )
            .then(success => {
                if (success) {
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

