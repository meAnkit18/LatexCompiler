const express = require("express");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.send("LaTeX API running 🚀");
});

app.post("/compile", (req, res) => {
  let dir;

  try {
    const latex = req.body.latex;

    if (!latex) {
      return res.status(400).send("No latex provided");
    }

    dir = fs.mkdtempSync(path.join(os.tmpdir(), "latex-"));

    const texPath = path.join(dir, "resume.tex");
    fs.writeFileSync(texPath, latex);

    execSync(
      "pdflatex -interaction=nonstopmode -halt-on-error resume.tex",
      {
        cwd: dir,
        timeout: 10000,
        stdio: "pipe",
      }
    );

    const pdfPath = path.join(dir, "resume.pdf");

    if (!fs.existsSync(pdfPath)) {
      return res.status(500).send("PDF not generated");
    }

    const pdf = fs.readFileSync(pdfPath);

    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);

  } catch (e) {
    console.error(e.stdout?.toString() || e.message);
    res.status(500).send("Compilation failed");
  } finally {
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  }
});

app.listen(3000, () => {
  console.log("LaTeX API running on port 3000");
});
