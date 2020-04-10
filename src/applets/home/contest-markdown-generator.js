export default ({ name, time, problems, ext, mode }, language = {}) => (
    `# \`${name}\``

    + `\n||\n|---|---|`

    + `\n|**Contest mode**|${mode}|`



    + `\n|**Time**|From **${time.start.toLocaleString()}** to **${time.end.toLocaleString()}**|`

    + `\n|**Problem(s) (\`${problems.length}\`)**|${problems.map(prob => `\`${prob}\``).join(', ')}|`

    + `\n|**Allowed language(s) (\`${ext.length}\`)**|${
        ext.map(ext => `**${language[ext.substr(1).toLowerCase()] || `<unknown>`}** (\`${ext.toLowerCase()}\`)`).join(', ')
    }|`

)
