"use strict";

var _SignPDF = _interopRequireDefault(require("./SignPDF"));

var _nodeFs = _interopRequireDefault(require("node:fs"));

var _nodePath = _interopRequireDefault(require("node:path"));

var UcertName;
var UpdfName;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

async function main(UpdfName, UcertName) {
  const pdfBuffer = new _SignPDF.default(
    _nodePath.default.resolve(`uploadPDF/${UpdfName}`),
    _nodePath.default.resolve(`uploadCERT/${UcertName}`)
  );
  const signedDocs = await pdfBuffer.signPDF();
  const randomNumber = Math.floor(Math.random() * 5000);
  const pdfName = `./exports/Signed_${UpdfName}`;

  _nodeFs.default.writeFileSync(pdfName, signedDocs);
  console.log(`New Signed PDF created called: ${pdfName}`);
}

const storage = multer.diskStorage({
  destination: "./uploadPDF",
  filename: (req, file, cb) => {
    UpdfName = `${file.fieldname}_${Date.now()}${path.extname(
      file.originalname
    )}`;

    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const storage1 = multer.diskStorage({
  destination: "./uploadCERT",
  filename: (req, file, cb) => {
    UcertName = `${file.fieldname}_${Date.now()}${path.extname(
      file.originalname
    )}`;

    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000000000,
  },
});
const upload1 = multer({
  storage: storage1,
  limits: {
    fileSize: 10000000000000,
  },
});

router.use("/File", express.static("uploadPDF"));
router.use("/File", express.static("uploadCERT"));

router.post("/uploadPDF", upload.single("file"), (req, res) => {
  res.json({
    success: 1,
    File_url: `http://localhost:8080/file/${req.file.filename}`,
  });
});
router.post("/uploadCERT", upload1.single("file"), (req, res) => {
  res.json({
    success: 1,
    File_url: `http://localhost:8080/file/${req.file.filename}`,
  });
});
router.get("/sign", async (req, res) => {
  try {
    await main(UpdfName, UcertName);
    res.send("successfully Signed");
  } catch (err) {
    console.log(err, "SomeThing Went Wrong ..");
  }
});
router.get("/", async (req, res) => {
  res.send("hello world");
  /* try {
    let doc = `./exports/Signed_${UpdfName}`;

    fs.access(doc, fs.constants.F_OK, (err) => {
      //check that we can access  the file
      console.log(`${doc} ${err ? "does not exist" : "exists"}`);
    });

    fs.readFile(doc, function (err, content) {
      if (err) {
        res.writeHead(404, { "Content-type": "text/html" });
        res.end("<h1>No such image</h1>");
      } else {
        //specify the content type in the response will be an image
        res.writeHead(200, { "Content-type": "application/pdf" });
        res.end(content);
      }
    });
  } catch (err) {
    console.log(err, "SomeThing Went Wrong ..");
  } */
});

module.exports = router;
