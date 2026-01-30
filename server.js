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
  (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);

    if (err) {
      return res.status(500).send(stderr);
    }

    const pdfPath = texPath.replace(".tex", ".pdf");

    if (!fs.existsSync(pdfPath)) {
      return res.status(500).send("PDF not generated");
    }

    res.download(pdfPath, "output.pdf");
  }
);

});

app.listen(3000, () => console.log("Server running on 3000"));
