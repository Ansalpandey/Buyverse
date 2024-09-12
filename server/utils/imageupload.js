const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const uploadImagesToS3 = async (files) => {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const uploadPromises = files.map(async (file) => {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const data = await s3Client.send(new PutObjectCommand(uploadParams));
      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
      return imageUrl; // Return the uploaded image's URL
    } catch (error) {
      throw new Error(error);
    }
  });

  return Promise.all(uploadPromises); // Resolve all promises
};

module.exports = uploadImagesToS3;
