/**
 * @desc Fetch the submission table
 * @param {Number} count - Total number of subs counted for response
 * @param {Number} size - Response size
 * @param {Number} page - Page number
 */
async function subs (count, page, size) {
    // `count` subs splitted by `size` and `page`-th array returned

    // construct query
    let out = new URLSearchParams(), { isSafeInteger } = Number;
    if (isSafeInteger(count)) out.append('count', count);
    if (isSafeInteger(page)) out.append('page', page);
    if (isSafeInteger(size)) out.append('size', size);


    return fetch(`/api/subs?${out.toString()}`)
        .then(res => res.json())
}

/**
 * @desc Fetch the submission
 * @param {String} id - Submission ID
 */
async function subsId (id) {
    return fetch(`/api/subs/${encodeURIComponent(id)}`)
        .then(res => res.json())
}

/**
 * @desc Fetch source code of submission
 * @param {String} id - Submission ID
 */
 async function subsIdSource (id) {
     return fetch(`/api/subs/${encodeURIComponent(id)}/source`)
         .then(res => res.text())
 }

export default subs;
export { subs, subsId, subsIdSource };
