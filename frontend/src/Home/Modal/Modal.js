// import React from 'react';
// import CreateRoomForm from '../Form/CreateRoomForm'
// import JoinRoomForm from '../Form/JoinRoomForm';
// import './Modal.css';

// function Modal(props) {

//     const form = (props.modalTitle === 'Create Room') ?
//         <CreateRoomForm handleClose={props.handleClose} /> :
//         <JoinRoomForm handleClose={props.handleClose} />

//     if (!props.show) {
//         return null;
//     }

//     else {
//         return (
//             <div className="modal">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h4 className="modal-title">{props.modalTitle}</h4>
//                     </div>
//                     <div className="modal-body">
//                         {form}
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }

// export default Modal;


// ======================================================


import React, { useEffect } from 'react';
import { Container, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CreateRoomForm from '../Form/CreateRoomForm'
import JoinRoomForm from '../Form/JoinRoomForm';
import './Modal.css'

function HomeModal(props) {

    // const useStyles = makeStyles((theme) => (
    //     {
    //         paper: {
    //             position: 'fixed',
    //             left: 0,
    //             top: 0,
    //             right: 0,
    //             bottom: 0,
    //             backgroundColor: 'rgba(235, 207, 207, 0.5)',
    //             display: 'flex',
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             // position: 'absolute',
    //             // top: 40 + '%',
    //             // left: 12 + '%',
    //             // transform: 'translateY(' + -50 + '%), translateX(' + -50 + '%)',
    //             // margin: 'auto',
    //             // //display: 'flex',
    //             // justifyContent: 'center',
    //             // verticalAlign: 'middle',
    //             // width: 100,
    //             // height: 100,
    //             // backgroundColor: theme.palette.background.paper,
    //             // border: '2px solid #000',
    //             // boxShadow: theme.shadows[5],
    //             // padding: theme.spacing(3, 4, 3),

    //         }
    //     }
    // ))

    // const classes = useStyles();

    const form = props.modalTitle === 'Create Room' ?
        <CreateRoomForm handleClose={props.handleClose} /> :
        <JoinRoomForm handleClose={props.handleClose} />

    const body = (
        <div className="modal-content">
            {/* //className={classes.paper}> */}
            <h3 className="modal-title">
                {props.modalTitle}
            </h3>
            <div className="modal-body">
                {form}
            </div>
        </div>
    )

    return (
        <div>
            <Container  >
                <Modal
                    className="modal"
                    open={props.show}
                    onClose={props.handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal>
            </Container>
        </div>
    )
}

export { HomeModal }