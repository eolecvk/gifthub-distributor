import { LinearProgress, Typography, Box } from '@material-ui/core';

function AmountDistributedProgressBar(props) {
    const { amountDistributed, amountTotal } = props;
    const progress = Math.floor((amountDistributed / amountTotal) * 100);
    return (
        <div
            style={{
                marginTop: 25 + 'px',
                marginBottom: 25 + 'px',
            }}
        >
            <Box>
                <Typography variant="body1" color="textPrimary">
                    Amount distributed:
                </Typography>
                <Box display="flex" alignItems="center">
                    <Box width="65%" mr={2}>
                        <LinearProgress variant="determinate" value={progress} />
                    </Box>
                    <Typography
                        variant="body1"
                        color="textSecondary"
                    >{`${amountDistributed}/${amountTotal} $`}</Typography>
                </Box>
            </Box>
        </div>
    );
}

export default AmountDistributedProgressBar;
