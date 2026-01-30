const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const os = require("os");

const app = express();

app.use(express.text({ limit: "5mb" }));

app.post("/compile", async (req, res) => {
    const tex = req.body;

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "latex-"));
    const texPath = path.join(dir, "main.tex");

    fs.writeFileSync(texPath, tex);

    exec(`tectonic main.tex`, { cwd: dir }, (err) => {
        if (err) return res.status(500).send("Compilation failed");

        const pdf = fs.readFileSync(path.join(dir, "main.pdf"));

        res.setHeader("Content-Type", "application/pdf");
        res.send(pdf);
    });
});

app.listen(10000, () => console.log("running on 10000"));
