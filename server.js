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

    exec(`tectonic main.tex`, { cwd: dir }, (err, stdout, stderr) => {
        if (err) {
            console.log(stderr);
            return res.status(500).send(stderr); // send real error
        }

        const pdfPath = path.join(dir, "main.pdf");

        if (!fs.existsSync(pdfPath)) {
            return res.status(500).send("PDF not generated");
        }

        const pdf = fs.readFileSync(pdfPath);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=output.pdf");

        res.send(pdf);
    });

});

app.listen(10000, () => console.log("running on 10000"));
