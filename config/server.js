import { readFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import uuidv4 from "uuid/v4";

import { cwd } from "./cwd";

require("dotenv").config();

export const staticFolder = "static";
if (!existsSync(staticFolder)) mkdirSync(staticFolder);

export const contestConfig = join(cwd, "contest.json");

let contestObj = {};
let name, startTime, endTime, mode;

try {
    contestObj = JSON.parse(readFileSync(contestConfig));
    ({ name, startTime, endTime, mode } = contestObj);
    if (!Array.isArray(startTime) && !Array.isArray(endTime)) throw new Error();
} catch (err) {
    throw new Error("Invalid contest file. See contest.sample.json");
}

export default {
    displayName: process.env.SERVERNAME || "Wafter - Themis Distributed Server",
    port: process.env.PORT || 3000,
    secret: process.env.SECRET || uuidv4(),
    contest: {
        // Change this to config contest time
        name: name,
        startTime: new Date(...startTime),
        endTime: new Date(...endTime),
        mode: mode
    }
};
