// minute => +hh:mm
const toTime = (minute) => {
    let hr = Math.floor(Number(minute) / 60), min = Number(minute) % 60;
    return `${hr < 10 ? '0' + hr : hr}:${min < 10 ? '0' + min : min}`;
}

export default toTime;
