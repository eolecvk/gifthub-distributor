import React from 'react'
import Form from '../Form/Form'
import './Modal.css'

function Modal(props) {

    if (!props.show) {
        return null
    }

    return (
        <div className='modal'>
            <div className='modal-content'>
                <div className='modal-header'>
                    <h4 className='modal-title'>
                        {props.modalTitle}
                    </h4>
                </div>
                <div className='modal-body'>
                    <Form formName={props.modalTitle} onSubmit={props.onClose}/>
                </div>
                <div className='modal-footer'>
                    <button
                        className='button'
                        onClick={props.onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}


export default Modal;