const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./upload",
  filename: (req, file, cb) => {
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

app.use("/File", express.static("upload"));
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    success: 1,
    File_url: `http://localhost:4000/file/${req.file.filename}`,
  });
});

function errHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.json({
      success: 0,
      message: err.message,
    });
  }
}
app.use(errHandler);
app.listen(4000, () => {
  console.log("server up and running");
});
