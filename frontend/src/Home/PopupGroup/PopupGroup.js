import React, { useState } from "react"
import Modal from "../Modal/Modal";
import './PopupGroup.css'

function PopupGroup(props) {

    const [show, setShow] = useState(false);
  
    return (
      <div>
        <button
          onClick={() => setShow(true)}>
          {props.buttonTitle}
        </button>
  
        <Modal
          onClose={() => setShow(false)}
          show={show}
          modalTitle={props.buttonTitle}
        />
      </div>
    )
  }

export default PopupGroup