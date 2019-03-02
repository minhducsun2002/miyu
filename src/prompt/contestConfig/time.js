"use strict";

const Enquirer = require("enquirer");
const getNow = require("../../util/getNow");
const contestConfig = require("../../util/config/contestConfig");

const enquirer = new Enquirer();

const timeList = (() => {
    let now = getNow();
    const res = {};
    for (let i = 0; i < 40; ++i) {
        res[now.toLocaleString()] = new Date(now);
        now.setMinutes(now.getMinutes() + 15);
    }
    return res;
})();

const offSetList = (() => {
    let now = new Date(0);
    const res = {};
    for (let i = 1; i <= 40; ++i) {
        now.setMinutes(now.getMinutes() + 15);
        let str = "";
        if (now.getHours() > 7) str += (now.getHours() - 7).toString() + " hr ";
        if (now.getMinutes() !== 0) str += now.getMinutes().toString() + " min";
        res[str.trim()] = i * 15 * 60 * 1000;
    }
    return res;
})();

/**
 * Change time prompt
 */
async function timePrompt() {
    const { startTime, endTime } = await enquirer
        .prompt([
            {
                type: "select",
                name: "startTime",
                message: "Start time:",
                choices: Object.keys(timeList),
                limit: 1,
                result: (val) => timeList[val]
            },
            {
                type: "select",
                name: "offset",
                message: "Duration:",
                choices: Object.keys(offSetList),
                limit: 1,
                result: (val) => offSetList[val]
            }
        ])
        .then((value) => {
            value.endTime = new Date(value.startTime.getTime() + value.offset);
            value.startTime = value.startTime.toJSON();
            value.endTime = value.endTime.toJSON();
            return value;
        });

    contestConfig.update({ startTime, endTime });
}

module.exports = timePrompt;
