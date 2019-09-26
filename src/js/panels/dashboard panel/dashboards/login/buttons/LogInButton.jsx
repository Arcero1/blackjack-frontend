import React from "react"
import {
  OverlayTrigger,
  Tooltip,
  Button
} from "react-bootstrap";

export default function LogInButton(props) {
  let buttonText = props.userExists ? "LogIn" : "Create Account";

  if (!props.userExists && (props.emailInvalidMessage || props.passwordInvalidMessage)) {
    return (
      <OverlayTrigger
        placement="bottom-middle"
        overlay={
          <Tooltip id="tooltip-disabled">
            {props.emailInvalidMessage ? `email: ${props.emailInvalidMessage}` : null}
            <br/>
            {props.passwordInvalidMessage ? `password: ${props.passwordInvalidMessage}` : null}
          </Tooltip>}>
                        <span className="d-inline-block">
                            <Button variant="primary" onClick={props.onClick}
                                    disabled style={{pointerEvents: 'none'}} block>
                                {buttonText}
                            </Button>
                        </span>
      </OverlayTrigger>
    )
  }

  return (
    <Button variant="primary" onClick={props.onClick}
            block>
      {buttonText}
    </Button>
  )

}