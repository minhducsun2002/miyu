import Console from "console";
import { readFileSync, existsSync } from "fs";
import { extname } from "path";
import Enquirer from "enquirer";
import neatCsv from "neat-csv";

import { newUser } from "../data/database";

const enquirer = new Enquirer();

/**
 * Import array of UserData { username, password, isAdmin }
 * @param {Array<Object>} data
 */
async function ImportUserData(data) {
    return Promise.all(
        data.map((a) =>
            newUser(a.username, a.password, a.isAdmin).then(
                () => Console.log(`Added ${JSON.stringify(a.username)}`),
                (err) =>
                    Console.log(
                        `Failed to add ${JSON.stringify(a.username)}: ${
                            err.message
                        }`
                    )
            )
        )
    );
}

/**
 * Import data file prompt
 */
async function ImportUserFilePrompt(ext, parseFun) {
    const { sourceFile } = await enquirer.prompt([
        {
            type: "input",
            name: "sourceFile",
            message: `Locate ${ext} file`,
            validate: (path) => existsSync(path) && extname(path) === ext
        }
    ]);
    const fileBlob = readFileSync(sourceFile, "utf8");
    return parseFun(fileBlob).then(ImportUserData);
}

/**
 * Add user prompt
 */
async function addUserPrompt() {
    let userChoicesContainer = {
        "Import from CSV": () => ImportUserFilePrompt(".csv", neatCsv),
        "Import from JSON": () => ImportUserFilePrompt(".json", JSON.parse)
    };
    const { addChoice } = await enquirer.prompt([
        {
            type: "autocomplete",
            name: "addChoice",
            message: "How do you want to add ?",
            choices: Object.keys(userChoicesContainer)
        }
    ]);

    return userChoicesContainer[addChoice]();
}

export default addUserPrompt;
