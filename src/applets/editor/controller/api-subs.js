/**
 * @desc Function to submit code using `POST` `fetch()`
 * @param {String} code - code
 * @param {String} filename - file name
 */
export default async (code, filename) => {
    let body = new FormData();
    body.append('code', new File([code], `${filename}`), `${filename}`);
    return fetch(`/api/subs`, { method: 'POST', body });
}
