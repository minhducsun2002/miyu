/**
 * @name passwordChange
 * @description Change password. Reload the page upon successful response.
 * @param {String} userId - user ID to change password
 * @param {String} password - old password
 * @param {String} newPassword - new password
 */

export default async function passwordChange(userId, password, newPassword) {
    const body = new URLSearchParams();
    body.append('password', password);
    body.append('newPassword', newPassword);

    return fetch(`/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        mode: 'cors',
        body
    })
        .then(res => res.ok)
        // if fail, then NOT okay
        .catch(() => false)
}
