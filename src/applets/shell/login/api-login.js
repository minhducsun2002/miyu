/**
 * @param {String} username - Username
 * @param {String} password - Password
 * @return {Promise<any>} A Promise that resolves to a Boolean indicating whether the login attempt succeeded
 */

export default async function (username, password) {
    let out = new URLSearchParams();
    out.append('username', username);
    out.append('password', password);

    return fetch(`/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: out,
        mode: 'cors'
    })
        .then(res => res.ok)
        .catch(err => {
            if (process.env.NODE_ENV === 'development') console.log(err);
            return false;
        });
}
