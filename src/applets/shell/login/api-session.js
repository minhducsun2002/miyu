/**
 * @name verifyLogin
 * @desc Verify user permission if logged in using `/api/users` route of Wafter
 * @returns {Promise<Object{}>}
 * @author minhducsun2002
 */

export default async function () {
    return fetch(`/api/users`)
        .then(res => {
            if (!res.ok) throw new Error('Attempt to automatically log in failed');
            return res.text();
        })
        .then(response => {
            const payload = JSON.parse(response);
            return {
                loggedIn: true,
                username: payload.username,
                id: payload._id,
                isAdmin: payload.isAdmin
            }
        })
        .catch(err => {
            if (process.env.NODE_ENV === 'development')
                // hide all errors on production builds
                console.log(err);
            return {
                loggedIn: false,
                username: null,
                id: null,
                isAdmin: null
            };
        });
}
