import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import CustomButton from '../CustomButton';
import { formatAsUSD } from '../utils';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

// [Voters Management form]
// (voterName) (distributedAmount) [KICK]
// ...

function VotersManagementForm(props) {
    const { roomCode } = props;

    const [roomInfo, setRoomInfo] = useState(JSON.parse(sessionStorage.getItem('roomInfo')));

    const refreshRoomInfo = () => {
        axios
            .get(`/api/${roomCode}`)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.setItem('roomInfo', JSON.stringify(response.data));
                    setRoomInfo(response.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        const interval = setInterval(refreshRoomInfo, 300);
        return () => clearInterval(interval);
    });

    const handleKickVoter = (e, voterId) => {
        e.preventDefault();

        const confirmRes = window.confirm('Are you sure you want to kick the voter?');
        if (confirmRes === false) {
            return;
        }

        const payload = {
            events: [
                {
                    kind: 'VOTER_REMOVE',
                    voter_id: voterId,
                },
            ],
        };

        axios
            .put(`/api/${roomCode}`, payload)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.setItem('roomInfo', JSON.stringify(response.data));
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const voters = roomInfo.voters.map((voter) => {
        const voterId = voter.voter_id;
        const name = voter.name;
        const distributedDollars = formatAsUSD(voter.distributed_cents / 100);
        const totalDollars = formatAsUSD(roomInfo.splitting_cents / 100);
        const progress = `${distributedDollars} / ${totalDollars}`;
        const textColor = {
            color:
                voter.distributed_cents > roomInfo.splitting_cents ? 'rgb(255 0 0)' : 'rgb(0 0 0)',
        };

        return (
            <Grid container spacing={3} justify="flex-end" alignItems="center">
                <Grid item>{name}</Grid>
                <Grid style={textColor} item>
                    {progress}
                </Grid>
                <Grid item>
                    <CustomButton
                        title="kick"
                        startIcon={<HighlightOffIcon />}
                        size="medium"
                        onClick={(e) => {
                            handleKickVoter(e, voterId);
                        }}
                    />
                </Grid>
            </Grid>
        );
    });
    return voters;
}

export default VotersManagementForm;
