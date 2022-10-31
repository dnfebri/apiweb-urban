import aws from "aws-sdk";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import fs from "fs";

const { REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKEET_NAME, S3_ENDPOINT} = process.env;

const spaceEnpoint = new aws.Endpoint(S3_ENDPOINT);
const s3 = new aws.S3({
  region: REGION,
  endpoint: spaceEnpoint,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
  },

});

export const uploadImage = async function (image, folder, nameFile) {
  const data = image.data.toString('base64')
  const file = new Buffer.from(data.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  const params = {
      Bucket: BUCKEET_NAME + '/uaweb/' + folder,
      Key: nameFile,
      Body: file,
      ACL: "public-read",
      ContentEncoding: 'base64',
      ContentType: image.mimetype,
  }

  return await s3.upload(params).promise().then(data => { return data }).catch(err => {
      console.log(err);
  });
}

export const deleteImage = async function (keyFile) {
  const params = {
      Bucket: BUCKEET_NAME,
      Key: 'uaweb/' + keyFile
  }
  await s3.deleteObject(params).promise().then(data => { return data }).catch(err => {
    console.log(err); return err
  });
}

export const getImages = async(folder) => {
  const params = {
    Bucket: BUCKEET_NAME,
    Prefix: 'uaweb/' + folder
  }

  return await s3.listObjects(params).promise().then(data => { return data }).catch(err => {
    console.log(err); return err
  });
}


