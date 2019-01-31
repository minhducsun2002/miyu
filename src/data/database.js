import bcrypt from "bcryptjs";
import { join } from "path";
import cwd from "../config/cwd";
import Datastore from "nedb";
import { TextEncoder } from "util";
import isUsername from "../util/isUsername";

let db = {};
db.users = new Datastore({
    filename: join(cwd, "data", "users.db"),
    autoload: true
});
db.users.persistence.setAutocompactionInterval(5000);
db.submissions = new Datastore({
    filename: join("data", "submissions.db"),
    autoload: true
});
db.submissions.persistence.setAutocompactionInterval(5000);

const PageSize = 50;

/**
 * User Schema Object
 * _id:             User's ID
 * username:        User's Name
 * pass:            User's password
 * isAdmin:         True if user is admin
 *
 * "Accepted" is the only verdict that will be count
 */

/**
 * Add user to database
 * @param {String} username User's name
 * @param {String} pass User's password
 * @param {Boolean} isAdmin Is user's an admin
 * @returns {Promise} User's ID if success
 */
export async function newUser(username, pass, isAdmin = false) {
    const passHash = bcrypt.hash(pass, bcrypt.genSaltSync(10));
    try {
        await readUser(username);
        throw new Error("Username has been taken");
    } catch (err) {
        if (err.message !== "Invalid username") throw err;
    }
    if (new TextEncoder().encode(pass).length > 72)
        throw new Error("Password's length is too long");
    else if (!isUsername(username))
        throw new Error("Username included invalid characters");
    else {
        const hashedPass = await passHash;
        return new Promise((resolve, reject) => {
            db.users.insert(
                [
                    {
                        username: username,
                        pass: hashedPass,
                        isAdmin: !!isAdmin
                    }
                ],
                function(err, docs) {
                    if (err) reject(err);
                    else resolve(docs[0]._id);
                }
            );
        });
    }
}

/**
 * Retrieve list of users in database
 * @returns {Promise} Array of user if success
 */
export function readAllUser(includeAdmin = false) {
    let isAdminSchema = [false];
    if (includeAdmin) isAdminSchema.push(true);
    return new Promise((resolve, reject) => {
        db.users.find(
            { isAdmin: { $in: isAdminSchema } },
            { username: 1, isAdmin: 1 },
            function(err, docs) {
                if (err) reject(err);
                else resolve(docs);
            }
        );
    });
}

/**
 * Retrieve User's data in database by using username
 * @param {String} username User's id
 * @returns {Promise} User's info if success
 */
export function readUser(username) {
    return new Promise((resolve, reject) => {
        db.users.findOne(
            { username: username },
            { username: 1, isAdmin: 1 },
            function(err, docs) {
                if (err) reject(err);
                else if (docs === null) reject(new Error("Invalid username"));
                else resolve(docs);
            }
        );
    });
}

/**
 * Retrieve User's data in database by using user's id
 * @param {String} id User's id
 * @returns {Promise} User's info if success
 */
export function readUserByID(id) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ _id: id }, { username: 1, isAdmin: 1 }, function(
            err,
            docs
        ) {
            if (err) reject(err);
            else if (docs === null) reject(new Error(`Invalid user_id: ${id}`));
            else resolve(docs);
        });
    });
}

/**
 * Retrieve User's hash in database by using user's id
 * @param {String} id User's id
 * @returns {Promise} User's info if success
 */
export function readUserPassHash(id) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ _id: id }, { pass: 1 }, function(err, docs) {
            if (err) reject(err);
            else if (docs === null) reject(new Error(`Invalid user_id: ${id}`));
            else resolve(docs.pass);
        });
    });
}

/**
 * Update User's data in database
 * @param {String} user_id User's id
 * @param {String} username Username
 * @param {String} new_username New username
 * @param {String} old_pass Old password
 * @param {String} new_pass New password
 *
 */
export async function updateUser(
    user_id,
    username,
    new_username,
    old_pass,
    new_pass
) {
    const dbUserID = await readUserByID(user_id);
    const dbUserPassHash = await readUserPassHash(user_id);

    // Carefully qualify so no memory leak happen
    const isHashMatch = bcrypt.compare(old_pass, dbUserPassHash);
    const newHashPass = bcrypt.hash(new_pass, bcrypt.genSaltSync(10));

    if (dbUserID.username !== username) throw new Error("Username mismatch");

    if (username !== new_username)
        try {
            await readUser(new_username);
            throw new Error("Username has been taken");
        } catch (err) {
            if (err.message !== "Invalid username") throw err;
        }

    if (!(await isHashMatch)) throw new Error("Wrong password");

    const newHash = await newHashPass;
    return new Promise((resolve, reject) => {
        db.users.update(
            { _id: user_id, pass: dbUserPassHash, username: username },
            {
                $set: {
                    username: new_username,
                    pass: newHash
                }
            },
            {},
            function(err, numAffected) {
                if (err) reject(err);
                else if (numAffected === 0)
                    reject(new Error("Nothing changed"));
                else resolve("Password changed");
            }
        );
    });
}

// /**
//  * Submission Schema Object
//  * _id:             Submission's ID
//  * source_code:     Source code path
//  * ext:             Source code extension
//  * status:          Submission Status
//  * date:            Submission Date (Db first receive)
//  * user_id:         User's ID of submission
//  * prob_id:         Problem's ID of submission
//  * score:           Submission's score (like in OI)
//  * tpen:            Submission's penalty (like in ACM)
//  * tests:           Submission's tests result
//  */

/**
 * @typedef {Object} ReturnSubmission
 * @property {String} _id Submission's ID
 * @property {Number} ext Source code's extension
 * @property {String} status Submission's Status
 * @property {Date} date Submission's Date
 * @property {String} user_id Submission's User's ID
 * @property {String} prob_id Submission's Problem ID
 * @property {Number} score Submission's score
 * @property {Number} tpen Submission's penalty
 * @property {Array<TestCase>} tests Submission's tests result
 */

/**
 * Retrieve list of submissions in database
 * @returns {Promise<Array<ReturnSubmission>>} Array of submission if success
 */
export function readAllSubmissions(page) {
    if (isNaN(page) || page < 0) page = 0;
    return new Promise((resolve, reject) => {
        db.submissions
            .find(
                {},
                {
                    ext: 1,
                    status: 1,
                    date: 1,
                    user_id: 1,
                    prob_id: 1,
                    score: 1,
                    tpen: 1,
                    tests: 1
                }
            )
            .sort({ date: -1 })
            .skip(PageSize * page)
            .limit(PageSize)
            .exec((err, docs) => {
                // TODO: Decide what to do when there's invalid user
                // Currently, it will throw error with invalid user_id
                if (err) reject(err);
                else
                    Promise.all(
                        docs.map((doc) => readUserByID(doc.user_id))
                    ).then((usernameList) => {
                        let serialized = docs.map((doc, idx) => {
                            doc.username = usernameList[idx].username;
                            return doc;
                        });
                        resolve(serialized);
                    });
            });
    });
}

/**
 * Retrieve submission via sub_id
 * @param {String} sub_id Submission's ID
 * @returns {Promise<ReturnSubmission>} Submission's details if success
 */
export function readSubmission(sub_id) {
    return new Promise((resolve, reject) => {
        db.submissions.findOne(
            { _id: sub_id },
            {
                ext: 1,
                status: 1,
                date: 1,
                user_id: 1,
                prob_id: 1,
                score: 1,
                tpen: 1,
                tests: 1
            },
            function(err, docs) {
                if (err) reject(err);
                else if (docs === null)
                    reject(new Error(`Invalid Submission's ID: ${sub_id}`));
                else resolve(docs);
            }
        );
    });
}

/**
 * Retrieve list of submission via user_id
 * @param {String} user_id User's ID
 * @returns {Promise<Array<ReturnSubmission>>} Array of user's submissions if success
 */
export async function readUserSubmission(user_id, page) {
    const username = await readUserByID(user_id);
    if (isNaN(page) || page < 0) page = 0;
    return new Promise((resolve, reject) => {
        db.submissions
            .find(
                { user_id: user_id },
                {
                    ext: 1,
                    status: 1,
                    date: 1,
                    user_id: 1,
                    prob_id: 1,
                    score: 1,
                    tpen: 1,
                    tests: 1
                }
            )
            .sort({ date: -1 })
            .skip(PageSize * page)
            .limit(PageSize)
            .exec((err, docs) => {
                if (err) reject(err);
                else {
                    let serialized = docs.map((doc) => {
                        doc.username = username;
                        return doc;
                    });
                    resolve(serialized);
                }
            });
    });
}

/**
 * Add submission to database
 * @param {String} source_code Source Code
 * @param {String} user_id User's ID
 * @param {String} prob_id Problem's ID
 * @param {Number} tpen Submission's penalty
 * @param {Number} ext Source code's extension
 * @returns {Promise<String>} Submission's ID if success
 */
export async function newSubmission(source_code, user_id, prob_id, tpen, ext) {
    await readUserByID(user_id);
    return new Promise((resolve, reject) => {
        db.submissions.insert(
            [
                {
                    source_code,
                    ext,
                    status: "Pending",
                    date: new Date(),
                    user_id,
                    prob_id,
                    tpen,
                    score: null,
                    tests: null
                }
            ],
            function(err, docs) {
                if (err) reject(err);
                else resolve(docs[0]._id);
            }
        );
    });
}

/**
 * Update submission in database
 * @param {String} sub_id Submission's ID
 * @param {Object} new_verdict new verdict
 * @param {Number} score score
 */
export async function updateSubmission(sub_id, new_verdict, score, tests) {
    try {
        await readSubmission(sub_id);
    } catch (err) {
        throw new Error(`Incorrect reference: ${sub_id}`);
    }
    return new Promise((resolve, reject) => {
        db.submissions.update(
            { _id: sub_id },
            {
                $set: {
                    status: new_verdict,
                    score: score,
                    tests: tests
                }
            },
            {},
            function(err, numAffected) {
                if (err) reject(err);
                else if (numAffected === 0)
                    reject(Error(`Failed to update sub_id ${sub_id}`));
                else resolve("New verdict applied");
            }
        );
    });
}

/**
 * Retrieve last Satisfy result
 * @deprecated
 * @param {String} user_id user's id
 * @param {String} prob_id problem's id
 * @returns {Promise} Submission's details if success
 */
export async function readLastSatisfy(user_id, prob_id) {
    return new Promise((resolve, reject) => {
        db.submissions
            .find({
                user_id: user_id,
                prob_id: prob_id,
                status: { $ne: "Pending" }
            })
            .sort({ date: -1 })
            .exec((err, docs) => {
                if (err) reject(err);
                else if (!docs.length) resolve({});
                else resolve(docs.pop());
            });
    });
}

/**
 * Count to last Satisfy result
 * @param {String} sub_id Submission's ID
 * @returns {Promise<Number>} Number of satisfy submissions
 */
export async function countPreviousSatisfy(sub_id) {
    return new Promise((resolve, reject) => {
        readSubmission(sub_id).then(
            (sub_data) => {
                db.submissions.count(
                    {
                        user_id: sub_data.user_id,
                        prob_id: sub_data.prob_id,
                        date: { $lt: sub_data.date },
                        status: { $ne: "Pending" }
                    },
                    function(err, docs) {
                        if (err) reject(err);
                        else resolve(docs);
                    }
                );
            },
            (err) => {
                reject(err);
            }
        );
    });
}

/**
 * Retreive the best submission among the list
 * @param {String} user_id user's id
 * @param {String} prob_id problem's id
 * @param {ContestType} ctype contest's type
 * @returns {Promise<ReturnSubmission>} the best submission if possible, null if none exists
 */
export function bestSubmission(user_id, prob_id, ctype) {
    return new Promise((resolve, reject) => {
        db.submissions
            .find({
                user_id: user_id,
                prob_id: prob_id,
                status: { $in: ctype.acceptedStatus }
            })
            .sort({ date: -1 })
            .exec((err, docs) => {
                if (err) reject(err);
                else if (!docs.length) resolve(null);
                else {
                    docs.sort(ctype.sortSub);
                    let doc = docs[0];
                    countPreviousSatisfy(doc._id).then((atmp) => {
                        doc.attempt = atmp + 1;
                        resolve(doc);
                    });
                }
            });
    });
}