const express = require("express");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.post("/compile", (req, res) => {
  try {
    const latex = req.body.latex;

    if (!latex) return res.status(400).send("No latex provided");

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "latex-"));
    const texPath = path.join(dir, "resume.tex");

    fs.writeFileSync(texPath, latex);

    execSync("tectonic resume.tex", {
      cwd: dir,
      timeout: 10000,
    });

    const pdf = fs.readFileSync(path.join(dir, "resume.pdf"));

    fs.rmSync(dir, { recursive: true, force: true });

    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);

  } catch (e) {
    res.status(500).send("Compilation failed");
  }
});

app.listen(3000, () => {
  console.log("LaTeX API running on port 3000");
});
