const uuid = require("uuid").v4;
const { Video } = require("../models/video.model");
const middleware = require("../middleware/index.middleware");
/**
 * 
 * Return the methods of the controller to process the upload the videos and get the list of the video *  
 * @Method :getListVideoById . Get the info of the video by searching by uuid()
 * @Method :getListVideo . Return a list of video save in the table video_model in mongodb
 * @Method :postUploadVideo . Upload the video from the client and save this one to a bucket S3 of Amazon
 * @return {obj} *  
 * */

const controller_api = (function () {
  return {
    getListVideoById: function (req, res) {
      const id = req.params.id;
      Video.findOne({ _id: id }).exec((err, videos) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, videos });
      });
    },
    getListVideo: function (req, res) {
      Video.find({}).exec((err, videos) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, videos });
      });
    
    },
    postUploadLocal: function (req, res) {
     
      middleware.createThumbnail(res).then((result) => {
        if (result === "finalizado") {
          //pasar el video a s3
          middleware.uploadFileS3(res.req.file, false).then((result) => {
            //pasar el thumnail
            middleware.uploadFileS3(res.req.file, true).then((result) => {
              let {Location, Bucket} = result;  
              console.log("aws informacion", result);              
              //pasar el thumbnail a s3
              //middleware.uploadFileS3(res.req.file,true);
              //eliminar el video local
              //eliminar el thumnail local
              middleware.deleteLocalsFile(res.req.file).then((result) => {
                //guardar en mongodb
                const element = res.req.file;
                const location_path = Location.substr(0,59);
                const video_model = new Video({
                  _id: uuid(),
                  location: Location,
                  bucket: Bucket,
                  filename: location_path + element.filename,
                  contentType: element.contentType,
                  encoding: element.encoding,
                  fieldname: element.fieldname,
                  key: element.key,
                  mimetype: element.mimetype,
                  originalname: element.originalname,
                  size: element.size,
                  thumbnail: location_path + element.filename.split(".")[0] + ".png",
                });

                video_model.save().then((result) => {
                  return res.json({
                    status: 200,
                    message: "Upload finish correctly",
                  });
                });
              });
            });
          });
        }
      });
    },
  };
})();

module.exports = controller_api;
