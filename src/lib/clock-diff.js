import dayjs from 'dayjs';

/**
 * @name timeAgo
 * @description return a `String` representing time delta from `date1` to `date2`
 * @param {Date} `date1`
 * @param {Date} `date2`
 * @returns {String}
 */

export default function timeAgo(date1, date2) {
    let from = dayjs(date1), to = dayjs(date2), parsed = {};
    ['year', 'month', 'day', 'hour', 'minute', 'second'].forEach(field => parsed[field] = to.diff(from, field))
    return (
        (parsed.day ? `${parsed.day}:` : '')
        + `${padding(parsed.hour % 24)}:${padding(parsed.minute % 60)}:${padding(parsed.second % 60)}`
    )
}

const padding = (string) => String(string).padStart(3 - String(string).length, '0')
