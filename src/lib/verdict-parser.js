// return human-friendly strings for verdicts
const friendlyVerdict = (string) => {
    if (!string) return 'Pending';
    switch (string.toUpperCase()) {
        case 'AC': return 'Accepted';
        case 'WA': return 'Wrong output';
        case 'TLE': return 'Time limit exceeded';
        case 'RTE': return 'Error during runtime';
        case 'CE': return 'Compilation error';
        default: return string;
    }
}

// return icons for verdicts

const friendlyIcon = (string) => {
    if (!string) return 'help';
    switch (string.toUpperCase()) {
        case 'AC': return 'tick';
        case 'WA': return 'error';
        case 'TLE': return 'outdated';
        case 'RTE': return 'warning-sign';
        case 'CE': return 'cross';
        default: return 'info-sign';
    }
}

// decide if result is positive
const isPositive = (string) => `${string}`.toLowerCase() === 'ac'

export default friendlyVerdict;
export { friendlyVerdict, friendlyIcon, isPositive }
