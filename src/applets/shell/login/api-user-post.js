/**
 * Register an user.
 * @param {string} username Username to register
 * @param {string} password Password to register
 */
async function register (username, password) {
    let out = new URLSearchParams();
    out.append('username', username);
    out.append('password', password);

    return fetch(`/api/users`, {
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

export default register;