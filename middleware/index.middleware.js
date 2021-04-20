const uuid = require("uuid").v4;
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");
const ffmpeg_static = require("ffmpeg-static");
//configuracion del ffmpeg para extraer los thumbnails
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const AWS = require("aws-sdk");

/**
 * 
 * Return an object with all functions transversal of the server *   *
 * @return {obj} *  
 * */


const options = {
  apiVersion: "2006-03-01",
  params: {
    Bucket: "bucket-videos-univision",
  },
  accessKeyId: "AKIASNN5SEDVR5XPEZ4I",
  secretAccessKey: "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",
  signatureVersion: "v4",
};

const s3 = new AWS.S3(options);



// Function to copy the data of the video to s3
const upload = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "bucket-videos-univision",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuid()}${ext}`);
    },
  }),
});

// Function to copy the data of the video to local folder
let upload_local = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuid()}${ext}`);
    },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      if (ext !== ".mp4") {
        return cb(res.status(400).end("only mp4 is allowed"), false);
      }
      cb(null, true);
    },
  }),
});

// Function to create the thumbnail in a local folder

const createThumbnail = function (res) {
  return new Promise((resolve, reject) => {
    ffmpeg(res.req.file.path)
      .setFfmpegPath(ffmpeg_static)
      .screenshots({
        timestamps: [0.0],
        filename: `${res.req.file.filename.split(".")[0]}` + ".png",
        folder: "uploads/thumbnails",
      })
      .on("end", () => {
        ffmpeg().on("end", () => ({ status: "createdss" }));
        resolve("finalizado");
      })
      .on("error", (err) => {
        return reject(new Error(err));
      });
  });
};

// Function to upload the local file to send to s3 bucket
function uploadFileS3(file, isthumnbnail) {
  let localPathVideo = "";
  let localfilename = "";
  let fileContent_video;

  if (!isthumnbnail) {
    localfilename = file.filename;
    localPathVideo = "uploads/" + file.filename;
    fileContent_video = fs.readFileSync(localPathVideo);
  } else {
    localfilename = file.filename.split(".")[0] + ".png";
    localPathVideo = "uploads/thumbnails/" + localfilename;
    fileContent_video = fs.readFileSync(localPathVideo);
  }

  // Setting up S3 upload parameters
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: "bucket-videos-univision",
      Key: localfilename,
      Body: fileContent_video,
    };

    const result = s3.upload(params, function (err, data) {
      if (err) {
        reject(new Error());
      }
      resolve(data);
    });
  });
}

// Function to delete the files local after to be loaded in s3
const deleteLocalsFile = function (file) {
  return new Promise((resolve, reject) => {
    let listFiles = [
      { filepath: file.path },
      {
        filepath: "uploads/thumbnails/" + file.filename.split(".")[0] + ".png",
      },
    ];

    listFiles.map(
      (file) =>{
        try {        
          fs.unlink(file.filepath, (err) => {
            if (err) throw err;
           
            resolve();
          });        
        } catch (error) {
          
          reject();
          return err;
        }
      }      
    )
  });
};

module.exports = {
  upload,
  upload_local,
  createThumbnail,
  uploadFileS3,
  deleteLocalsFile,
};
