const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const app = express();

/* ---------- multer config ---------- */
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit (protect server)
  },
});

/* ---------- compile endpoint ---------- */
app.post("/compile", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const texPath = req.file.path;
  const outputDir = path.dirname(texPath);

  const command = `pdflatex -interaction=nonstopmode -output-directory=${outputDir} ${texPath}`;

  exec(command, { timeout: 15000 }, (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);

    /* ❌ compilation error */
    if (err) {
      cleanup(texPath);
      return res.status(500).send("LaTeX compilation failed");
    }

    /* ✅ FIX: correct pdf path */
    const pdfPath = texPath + ".pdf";

    if (!fs.existsSync(pdfPath)) {
      cleanup(texPath);
      return res.status(500).send("PDF not generated");
    }

    /* ✅ send pdf */
    res.download(pdfPath, "output.pdf", () => {
      cleanup(texPath);
    });
  });
});

/* ---------- cleanup helper ---------- */
function cleanup(texPath) {
  const base = texPath;

  [base, base + ".pdf", base + ".aux", base + ".log"].forEach((f) => {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  });
}

/* ---------- start server ---------- */
app.listen(3000, () => console.log("Server running on 3000"));
