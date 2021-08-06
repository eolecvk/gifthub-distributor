import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container'
import Modal from '@material-ui/core/Modal';
import EditableNeedsForm from './EditableNeedsForm'
import { registerNeedsUpdate } from './utils'
import './EditableNeedsModal.css'

const useStyles = makeStyles((theme) => ({

  paper: {
    position: 'absolute',
    top: 25 + '%',
    left: 12 + '%',
    transform: 'translateY(' + -50 + '%), translateX(' + -50 + '%)',
    margin: 'auto',
    justifyContent: 'center',
    verticalAlign: 'middle',
    width: 220,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 4, 3),
  },
}));

function EditableNeedsModal(props) {

  const [open, setOpen] = React.useState(false);

  const handleSubmit = (newSurviveAmount, newThriveAmount, newNeedsDescription) => {
    const args = {
      needsLowerBoundCents: newSurviveAmount * 100,
      needsUpperBoundCents: newThriveAmount * 100,
      needsDescription: newNeedsDescription
    }
    registerNeedsUpdate(args, props.roomInfo.room_code)
    setOpen(false);
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();
  const body = (
    <div className={classes.paper}>
      <h3 id="simple-modal-title">Edit needs</h3>
      <EditableNeedsForm
        roomInfo={props.roomInfo}
        handleSubmit={handleSubmit} />
    </div>
  );

  return (
    <div className={classes.root} >
      <button id="edit-button" type="button" onClick={handleOpen}>
        Edit
      </button>
      <Container >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal>
      </Container>
    </div>
  );
}

export default EditableNeedsModal