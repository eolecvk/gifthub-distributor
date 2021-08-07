// import React, { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
// import axios from 'axios';
// import { TextField, Grid, Button, FormControlLabel, Switch } from '@material-ui/core';

// function JoinRoomForm(props) {
//     const history = useHistory();
//     const defaultValues = {
//         name: '',
//         roomCode: '',
//         isObserver: false,
//         needsDescription: '',
//         needsLowerBoundDollars: '',
//         needsUpperBoundDollars: '',
//     };
//     const [formValues, setFormValues] = useState(defaultValues);
//     const [errors, setErrors] = useState({})

//     useEffect(() => {
//         const name = "needsLowerBoundDollars"
//         const value = formValues.needsLowerBoundDollars

//         if (value < 0) {
//             setErrors({ ...errors, needsLowerBoundDollars: ':) < 0' })
//             return;
//         }
//         if (formValues.needsUpperBoundDollars && value > formValues.needsUpperBoundDollars) {
//             setErrors({ ...errors, needsLowerBoundDollars: ':) > :D' })
//             return;
//         }
//         const errorsTempLower = errors;
//         delete errorsTempLower.needsLowerBoundDollars;

//         // Delete error on thriveAmount field if change corrects issue
//         if (errorsTempLower.needsUpperBoundDollars === ':D < :)') {
//             delete errorsTempLower.needsUpperBoundDollars;
//         }
//         setErrors(errorsTempLower)
//     }, [formValues.needsLowerBoundDollars, formValues.needsUpperBoundDollars]);

//     useEffect(() => {
//         const name = "needsUpperBoundDollars"
//         const value = formValues.needsUpperBoundDollars

//         if (value < 0) {
//             setErrors({ ...errors, needsUpperBoundDollars: ':D < 0' })
//             return
//         }
//         if (formValues.needsLowerBoundDollars && value < formValues.needsLowerBoundDollars) {
//             setErrors({ ...errors, needsUpperBoundDollars: ':D < :)' })
//             return
//         }
//         const errorsTempUpper = errors;
//         delete errorsTempUpper.needsUpperBoundDollars;

//         // Delete error on thriveAmount field if change corrects issue
//         if (errorsTempUpper.needsLowerBoundDollars === ':) < :D') {
//             delete errorsTempUpper.needsLowerBoundDollars;
//         }
//         setErrors(errorsTempUpper)
//     }, [formValues.needsUpperBoundDollars, formValues.needsLowerBoundDollars]);



//     const handleInputChange = (e) => {
//         let { name, value } = e.target;

//         if (e.target.type === 'number') {
//             value = parseInt(value)
//         }

//         setFormValues(formValues => ({
//             ...formValues,
//             [name]: value
//         }))
//     };

//     const handleSwitchChange = (e) => {
//         const { name, checked } = e.target;

//         setFormValues({
//             ...formValues,
//             [name]: checked,
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (Object.keys(errors).length > 0) {
//             return;
//         }

//         const payload = {
//             participant: !formValues.isObserver,
//             name: formValues.name,
//             needs_description: formValues.needsDescription,
//             needs_lower_bound_cents: formValues.needsLowerBoundDollars * 100,
//             needs_upper_bound_cents: formValues.needsUpperBoundDollars * 100,
//         };

//         axios
//             .post(`/api/${formValues.roomCode}/join`, payload)
//             .then((response) => {
//                 if (response.status === 200) {
//                     sessionStorage.clear();
//                     sessionStorage.setItem('roomInfo', JSON.stringify(response.data.room_info));
//                     sessionStorage.setItem('userId', JSON.stringify(response.data.user_id));
//                     history.push(formValues.isObserver ? '/observer' : '/participant');
//                 }
//             })
//             .catch((error) => {
//                 console.log(error);
//                 if (error.response.data.error === 'That room does not exist') {
//                     alert('That room does not exist');
//                 }
//             });
//         props.handleClose();
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <Grid container alignItems="center" justifyContent="center" direction="column">
//                 <Grid container direction="row">
//                     <Grid item>
//                         <TextField
//                             id="room-code-input"
//                             name="roomCode"
//                             label="Room code:"
//                             type="string"
//                             value={formValues.roomCode}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </Grid>
//                     <Grid item xs style={{ marginTop: 10 }}>
//                         <FormControlLabel
//                             label="Observer mode"
//                             control={
//                                 <Switch
//                                     name="isObserver"
//                                     inputProps={{ 'aria-label': 'primary checkbox' }}
//                                     checked={formValues.isObserver}
//                                     onChange={handleSwitchChange}
//                                 />
//                             }
//                         />
//                     </Grid>
//                 </Grid>

//                 <Grid
//                     container
//                     style={{
//                         padding: 10,
//                         display: formValues.isObserver ? 'none' : 'block',
//                     }}
//                 >
//                     <Grid>
//                         <TextField
//                             id="name"
//                             name="name"
//                             label="Name:"
//                             type="string"
//                             value={formValues.name}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </Grid>
//                     <Grid
//                         container
//                         justifyContent="space-around"
//                         direction="row"
//                         style={{ marginTop: 10 }}
//                     >
//                         <Grid item xs={4}>
//                             <TextField
//                                 id="need-min-input"
//                                 name="needsLowerBoundDollars"
//                                 label="Survive ($):"
//                                 type="number"
//                                 value={formValues.needsLowerBoundDollars}
//                                 onChange={handleInputChange}
//                                 required
//                                 error={!!errors.needsLowerBoundDollars}
//                                 helperText={
//                                     errors.needsLowerBoundDollars && errors.needsLowerBoundDollars
//                                 }
//                             // inputProps={{
//                             //     min: 0,
//                             // }}
//                             />
//                         </Grid>
//                         <Grid item xs={4}>
//                             <TextField
//                                 id="need-max-input"
//                                 name="needsUpperBoundDollars"
//                                 label="Thrive ($):"
//                                 type="number"
//                                 value={formValues.needsUpperBoundDollars}
//                                 onChange={handleInputChange}
//                                 required
//                                 error={!!errors.needsUpperBoundDollars}
//                                 helperText={
//                                     errors.needsUpperBoundDollars && errors.needsUpperBoundDollars
//                                 }
//                             // inputProps={{
//                             //     min: formValues.needsLowerBoundDollars,
//                             // }}
//                             />
//                         </Grid>
//                     </Grid>
//                     <Grid item style={{ marginTop: 10 }}>
//                         <TextField
//                             id="need-description-input"
//                             name="needsDescription"
//                             label="Need description:"
//                             type="string"
//                             value={formValues.needsDescription}
//                             onChange={handleInputChange}
//                             multiline
//                             rows={4}
//                             variant="filled"
//                             fullWidth={true}
//                         />
//                     </Grid>
//                 </Grid>

//                 <Grid
//                     container
//                     alignItems="center"
//                     justifyContent="flex-end"
//                     style={{ marginTop: 20 }}
//                 >
//                     <Button variant="contained" color="primary" type="submit">
//                         Submit
//                     </Button>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         type="button"
//                         onClick={(e) => {
//                             props.handleClose();
//                         }}
//                     >
//                         Close
//                     </Button>
//                 </Grid>
//             </Grid>
//         </form>
//     );
// }

// export default JoinRoomForm;


// ============================================================

import React, { Component } from 'react'
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { TextField, Grid, Button, FormControlLabel, Switch } from '@material-ui/core';
import { withRouter } from "react-router";

class JoinRoomForm extends Component {

    constructor(props) {
        super(props)
        this.initialValues = {
            name: '',
            roomCode: '',
            isObserver: false,
            needsDescription: '',
            needsLowerBoundDollars: '',
            needsUpperBoundDollars: '',
        }

        this.state = {
            formValues: this.initialValues,
            errors: {}
        }
    }



    onChangeSurviveAmount = (e) => {

        let { name, value } = e.target

        if (value !== "") {
            value = parseInt(value)

            if (this.state.formValues.needsUpperBoundDollars && value > this.state.formValues.needsUpperBoundDollars) {
                this.setState(
                    {
                        formValues: {
                            ...this.state.formValues,
                            [name]: value
                        },
                        errors: {
                            ...this.state.errors,
                            [name]: ':) > :D'
                        }
                    }
                )
                return
            }

            if (value < 0) {
                this.setState(
                    {
                        formValues: {
                            ...this.state.formValues,
                            [name]: value
                        },
                        errors: {
                            ...this.state.errors,
                            [name]: ':) < 0'
                        }
                    }
                )
                return
            }
        }

        const errors = this.state.errors;
        delete errors.needsLowerBoundDollars;

        // Delete error on thriveAmount field if change corrects issue
        if (errors.needsUpperBoundDollars === ':D < :)') {
            delete errors.needsUpperBoundDollars;
        }
        this.setState(
            {
                formValues: {
                    ...this.state.formValues,
                    [name]: value
                },
                errors: {
                    ...errors
                }
            }
        )
    };

    onChangeThriveAmount = (e) => {

        let { name, value } = e.target

        if (value !== "") {
            value = parseInt(value)

            if (this.state.formValues.needsLowerBoundDollars &&
                value < this.state.formValues.needsLowerBoundDollars) {
                this.setState(
                    {
                        formValues: {
                            ...this.state.formValues,
                            [name]: value
                        },
                        errors: {
                            ...this.state.errors,
                            [name]: ':D < :)'
                        }
                    }
                )
                return
            }


            if (value < 0) {
                this.setState(
                    {
                        formValues: {
                            ...this.state.formValues,
                            [name]: value
                        },
                        errors: {
                            ...this.state.errors,
                            [name]: ':D < 0'
                        }
                    }
                )
                return
            }
        }

        const errors = this.state.errors;
        delete errors.needsUpperBoundDollars;

        // Delete error on thriveAmount field if change corrects issue
        if (errors.needsLowerBoundDollars === ':) > :D') {
            delete errors.needsLowerBoundDollars;
        }
        this.setState(
            {
                formValues: {
                    ...this.state.formValues,
                    [name]: value
                },
                errors: {
                    ...errors
                }
            }
        )
    };

    // onChangeNeedsDescription = (e) => {
    //     const { name, value } = e.target

    //     this.setState({
    //         formValues: {
    //             ...this.state.formValues,
    //             [name]: value
    //         },
    //         errors: {
    //             ...errors
    //         }
    //     })
    // };


    handleInputChange = (e) => {
        const { name, value } = e.target;

        this.setState(
            {
                formValues: {
                    ...this.state.formValues,
                    [name]: value
                },
                errors: { ...this.state.errors }
            }
        )
    }

    handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        this.setState(
            {
                formValues: {
                    ...this.state.formValues,
                    [name]: checked
                },
                errors: { ...this.state.errors }
            }
        )
    }

    handleSubmit = (e, history) => {
        e.preventDefault();

        if (Object.keys(this.state.errors).length > 0) {
            return;
        }

        const payload = {
            participant: !this.state.formValues.isObserver,
            name: this.state.formValues.name,
            needs_description: this.state.formValues.needsDescription,
            needs_lower_bound_cents: this.state.formValues.needsLowerBoundDollars * 100,
            needs_upper_bound_cents: this.state.formValues.needsUpperBoundDollars * 100,
        };

        axios
            .post(`/api/${this.state.formValues.roomCode}/join`, payload)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.clear();
                    sessionStorage.setItem('roomInfo', JSON.stringify(response.data.room_info));
                    sessionStorage.setItem('userId', JSON.stringify(response.data.user_id));
                    history.push(this.state.formValues.isObserver ? '/observer' : '/participant');
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response.data.error === 'That room does not exist') {
                    alert('That room does not exist');
                }
            });
        this.props.handleClose();
    }

    render() {

        const { history } = this.props

        return (
            <form onSubmit={(e) => { this.handleSubmit(e, history) }}>
                <Grid container alignItems="center" justifyContent="center" direction="column">
                    <Grid container direction="row">
                        <Grid item>
                            <TextField
                                id="room-code-input"
                                name="roomCode"
                                label="Room code:"
                                type="string"
                                value={this.state.formValues.roomCode}
                                onChange={this.handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs style={{ marginTop: 10 }}>
                            <FormControlLabel
                                label="Observer mode"
                                control={
                                    <Switch
                                        name="isObserver"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        checked={this.state.formValues.isObserver}
                                        onChange={this.state.handleSwitchChange}
                                    />
                                }
                            />
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        style={{
                            padding: 10,
                            display: this.state.formValues.isObserver ? 'none' : 'block',
                        }}
                    >
                        <Grid>
                            <TextField
                                id="name"
                                name="name"
                                label="Name:"
                                type="string"
                                value={this.state.formValues.name}
                                onChange={this.handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid
                            container
                            justifyContent="space-around"
                            direction="row"
                            style={{ marginTop: 10 }}
                        >
                            <Grid item xs={4}>
                                <TextField
                                    id="need-min-input"
                                    name="needsLowerBoundDollars"
                                    label="Survive ($):"
                                    type="number"
                                    value={this.state.formValues.needsLowerBoundDollars}
                                    onChange={this.onChangeSurviveAmount}
                                    required
                                    error={!!this.state.errors.needsLowerBoundDollars}
                                    helperText={
                                        this.state.errors.needsLowerBoundDollars && this.state.errors.needsLowerBoundDollars
                                    }
                                // inputProps={{
                                //     min: 0,
                                // }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="need-max-input"
                                    name="needsUpperBoundDollars"
                                    label="Thrive ($):"
                                    type="number"
                                    value={this.state.formValues.needsUpperBoundDollars}
                                    onChange={this.onChangeThriveAmount}
                                    required
                                    error={!!this.state.errors.needsUpperBoundDollars}
                                    helperText={
                                        this.state.errors.needsUpperBoundDollars && this.state.errors.needsUpperBoundDollars
                                    }
                                // inputProps={{
                                //     min: formValues.needsLowerBoundDollars,
                                // }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item style={{ marginTop: 10 }}>
                            <TextField
                                id="need-description-input"
                                name="needsDescription"
                                label="Need description:"
                                type="string"
                                value={this.state.formValues.needsDescription}
                                onChange={this.handleInputChange}
                                multiline
                                rows={4}
                                variant="filled"
                                fullWidth={true}
                            />
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        alignItems="center"
                        justifyContent="flex-end"
                        style={{ marginTop: 20 }}
                    >
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            onClick={(e) => {
                                this.props.handleClose();
                            }}
                        >
                            Close
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

export default withRouter(JoinRoomForm)