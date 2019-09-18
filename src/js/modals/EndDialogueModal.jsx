import React from "react";
import {
    Button,
    Modal
} from "react-bootstrap";

export default function EndDialogueModal(props) {
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