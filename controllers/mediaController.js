const {uploadToS3}= require("../services/uploadToS3");

const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = await uploadToS3(
      req.file.buffer,          //  BUFFER
      req.file.originalname,
      req.file.mimetype
    );

    res.status(200).json({
      success: true,
      url: fileUrl
    });

  } catch (err) {
    console.error("Media upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};
module.exports={uploadMedia}