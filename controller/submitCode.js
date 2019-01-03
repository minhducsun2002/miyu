import zipdir from "zip-dir";
import isZip from "is-zip";
import { basename, extname, join } from "path";
import { readFileSync } from "fs";

import { cwd } from "../config/cwd";
import Judger from "../driver/kon";
import { submitCode } from "../data/database";
import { updateSubmission } from "../data/database";

const Judgers = ["http://localhost:30000"].map((host) => new Judger(host));

/**
 * Qualify and add new server to Judgers
 * @param {String} serverAddress Exepected address of kon server
 */
export async function addJudger(serverAddress) {
    // TODO: Guarantee valid kon server
    const newJudger = new Judger(serverAddress);
    try {
        await newJudger.check();
    } catch (err) {
        // In case server return 503, add server to judgerList
        if (err === "Server is not ready") Judgers.push(newJudger);
    }
}

/**
 * Zip task folder then send it to Judgers
 * @param {PathLike} task_folder path to folder contains task file
 */
export function initJudgerFolder(task_folder) {
    const arcPath = join(cwd, "Tasks.zip");
    zipdir(task_folder, { saveTo: arcPath }, (err, buf) => {
        if (err) throw err;
        if (!isZip(buf)) throw Error("Invalid folder");
        initJudger(arcPath);
    });
}

/**
 * Send zipped task file to Judgers
 * @param {PathLike} taskZipPath path to folder contains task file
 */
export function initJudger(taskZipPath) {
    if (!isZip(readFileSync(taskZipPath)))
        throw Error("Given file is not a zip");
    const JudgePromise = Judgers.map((judger) => {
        judger.clone(taskZipPath);
    });
    // NOTE: This require all server to work
    // In case one server is down, this function will break
    // TODO: Safety handling error
    Promise.all(JudgePromise).catch((err) => {
        throw err;
    });
}

/**
 * Update submission status from log from kons'
 * @param {function} calc Calculate result, either ACM or OI
 */
export function reloadSubs(calc) {
    const judgerPromise = Judgers.map((judger) => judger.get());
    Promise.all(judgerPromise)
        .then((list) => [].concat.apply([], list))
        .then((subs) => {
            subs.forEach((sub) => {
                updateSubmission(sub.id, calc(sub));
            });
        })
        .catch((err) => {
            throw err;
        });
}

/**
 * Add submission to database then send part of it to Judger
 * @param {PathLike} source_code_path Path to source code
 * @param {String} user_id User's ID
 * @param {String} prob_name file's name
 */
export async function sendCode(source_code_path, user_id, prob_name) {
    try {
        prob_name = prob_name.toUpperCase();
        const prob_id = basename(prob_name, extname(prob_name));
        const sub_id = await submitCode(source_code_path, user_id, prob_id);
        const qPromise = Judgers.map((judger) => judger.qLength());

        const judgersQ = await Promise.all(qPromise);
        const judgerNum = judgersQ
            .map((val, iter) => [val, iter])
            .sort()
            .shift()[1];
        const judger = Judgers[judgerNum];

        judger.send(source_code_path, prob_name, sub_id).catch((err) => {
            throw err;
        });
        // setTimeout(reloadSub(ACM))
    } catch (err) {
        throw err;
    }
}
