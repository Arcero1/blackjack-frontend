import React from "react";
import {
  Button,
  Form,
  Modal
} from "react-bootstrap";

import {basicGET, basicPOST} from "../util/server";
import {STORAGE} from "../util/constants";

class ProfileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false
    };
  }

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id={"contained-modal-title-vcenter"}>
            please choose a name
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                id={"profile-modal-input"}
                className={this.state.canSubmit ? "profile-modal-fine" : "profile-modal-err"}
                onChange={this.handleProfilePromptChange}
                plaintext
              />
            </Form.Group>

            <Form.Group>
              <Button
                id={"profile-modal-button"}
                variant={this.state.canSubmit ? "success" : "danger"}
                onClick={this.submitProfileName}
                disabled={!this.state.canSubmit}
                block
              >
                Submit
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  submitProfileName = (event) => {
    event.preventDefault();

    let profileName = document.getElementById("profile-modal-input").value;
    basicPOST(
      "profiles",
      "create",
      JSON.stringify({
        owner: STORAGE.userName.getValue() ? STORAGE.userName.getValue() : "root",
        name: profileName
      })
    )
      .then(boolResponse => {
        if (boolResponse) STORAGE.profileName.setValue(profileName);
        this.props.onHide();
      });
  };

  handleProfilePromptChange = (event) => {
    let content = event.target.value;

    if (content.length > 20 || content === "") {
      if (this.state.canSubmit) { // prevent unnecessary re-renders
        this.setState({
          canSubmit: false
        })
      }
      return;
    }

    basicGET(
      "profiles",
      "validate",
      ["name"],
      [event.target.value]
    )
      .then(boolResponse => {
        if (this.state.canSubmit === boolResponse)
          this.setState({canSubmit: !boolResponse});
      });
  };
}

export default ProfileModal;

