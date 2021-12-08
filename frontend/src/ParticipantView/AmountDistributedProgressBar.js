import { LinearProgress, Typography, Box } from '@material-ui/core';
import { formatAsUSD } from '../utils';

function AmountDistributedProgressBar(props) {
    const { amountDistributed, amountTotal } = props;
    const progress = Math.floor((1 - amountDistributed / amountTotal) * 100);
    return (
        <div
            style={{
                marginTop: 25 + 'px',
                marginBottom: 25 + 'px',
            }}
        >
            <Box>
                <Typography variant="body1" color="textPrimary">
                    Amount remaining:
                </Typography>
                <Box display="flex" alignItems="center">
                    <Box width="55%" mr={2}>
                        <LinearProgress variant="determinate" value={progress} />
                    </Box>
                    <Typography variant="body1" color="textSecondary">{`${formatAsUSD(
                        amountTotal - amountDistributed
                    )}/${formatAsUSD(amountTotal)}`}</Typography>
                </Box>
            </Box>
        </div>
    );
}

export default AmountDistributedProgressBar;
