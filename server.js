const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/compile", upload.single("file"), (req, res) => {
  const texPath = req.file.path;
  const outputDir = path.dirname(texPath);

  exec(
    `pdflatex -interaction=nonstopmode -output-directory=${outputDir} ${texPath}`,
    (err) => {
      if (err) return res.status(500).send("Compilation failed");

      const pdfPath = texPath.replace(".tex", ".pdf");

      res.download(pdfPath, "output.pdf", () => {
        fs.rmSync(outputDir, { recursive: true, force: true });
      });
    }
  );
});

app.listen(3000, () => console.log("Server running on 3000"));
