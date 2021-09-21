import React from 'react';
import CustomButton from '../CustomButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ReactFileReader from 'react-file-reader';
import Papa from 'papaparse';
import axios from 'axios';

function RecipientsManagement(props) {
    const { roomCode } = props;

    const registerRecipients = (recipients) => {
        // Verify input file format
        const headers = Object.keys(recipients[0]);
        const requiredHeaders = ['name', 'survive', 'thrive', 'description'];
        let missingHeaders = [];
        requiredHeaders.forEach((requiredHeader) => {
            if (!headers.includes(requiredHeader)) {
                missingHeaders.push(requiredHeader);
            }
        });

        if (missingHeaders.length > 0) {
            alert(`Invalid input file format, missing headers: ${missingHeaders.toString()}`);
            return;
        }

        const events = recipients
            .filter((row) => {
                if (row['name'] === '') {
                    return false;
                }
                return true;
            })
            .map((recipient) => {
                const name = recipient['name'];
                const description = recipient['description'];
                const surviveCents = parseInt(recipient['survive']) * 100;
                const thriveCents = parseInt(recipient['thrive']) * 100;

                return {
                    kind: 'RECIPIENT_ADD',
                    name: name,
                    needs_upper_bound_cents: thriveCents,
                    needs_lower_bound_cents: surviveCents,
                    needs_description: description,
                };
            });

        const payload = { events: events };
        axios
            .put(`/api/${roomCode}`, payload)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.setItem('roomInfo', JSON.stringify(response.data));
                    alert(`Recipient upload successful!`);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleUploadRecipients = (files) => {
        Papa.parse(files[0], {
            complete: function (res) {
                registerRecipients(res.data);
            },
            header: true,
        });
    };

    return (
        <div>
            <h3>Recipients</h3>
            <p>Upload CSV with columns labeled 'name', 'survive', 'thrive' and 'description'</p>
            <div style={{ margin: 15 + 'px' }}>
                <ReactFileReader
                    handleFiles={handleUploadRecipients}
                    fileTypes={'.csv'}
                    multipleFiles={false}
                >
                    <CustomButton
                        title="Upload recipients data"
                        startIcon={<CloudUploadIcon />}
                        size="medium"
                    />
                </ReactFileReader>
            </div>
        </div>
    );
}

export default RecipientsManagement;
