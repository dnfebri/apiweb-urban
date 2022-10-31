import FotoKelas from "../models/FotoKelasModel.js";
import path from "path";
import fs from "fs";
import { getImages, deleteImage, uploadImage} from "../helpers/helper.js";
import { log } from "console";

export const getFotoKelases = async(req, res) => {
  try {
    const response = await FotoKelas.findAll({
      attributes:['id', 'name', 'clubId', 'image', 'url', 'description'],
      order: [
        ['id', 'DESC']
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const getFotoKelasById = async(req, res) => {
  try {
    const response =  await FotoKelas.findOne({
      attributes:['id', 'name', 'clubId', 'image', 'url', 'description'],
      where: {
        id: req.params.id
      }
    });
    if (!response) return res.status(404).json({msg: "Kelas tidak ditemukan"});
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const createFotoKelas = async(req, res) => {
  const { description, clubId } = req.body;
  if(req.files === null) return res.status(422).json({msg: "No file Uploaded"});
  const name = req.body.name;
  const file = req.files.image;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
  if(fileSize > 3000000) return res.status(422).json({msg: "Image must be less than 3 Mb"});

  const folder = "fotoKelas";
  const fileName = name.split(' ').join('_') + '-' + new Date().getTime() + ext;
  const image = await uploadImage(file, folder, fileName);
  const url = image.Location;

  // file.mv(`./public/images/foto_kelas/${fileName}`, async(err) => {
  //   if(err) return res.status(500).json({msg: err.message});
  // });
  try {
    await FotoKelas.create({
      name: name,
      clubId: clubId,
      image: fileName,
      url: url,
      description: description
    });
    res.status(201).json({msg: "Created Image Class Successfuly"});
  } catch (error) {
    res.status(500).json({msg: error.message}); 
  }
}

export const updateFotoKelas = async(req, res) => {
  const classes =  await FotoKelas.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!classes) return res.status(404).json({msg: "Class Image Not Found"});
  
  const { name, description, clubId } = req.body;
  let delImg = null;
  let fileName = classes.image;
  let url = classes.url;
  if(req.files) {
    const file = req.files.image;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const allowedType = ['.png', '.jpg', '.jpeg'];
  
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 3000000) return res.status(422).json({msg: "Image must be less than 3 Mb"});

    // Delete File in S3
    const prefix = "fotoKelas";
    let keyImage = prefix + '/' + classes.image;
    await deleteImage(keyImage);

    // Save / Upload file to S3
    const folder = prefix;
    fileName = name.split(' ').join('_') + '-' + new Date().getTime() + ext;
    const image = await uploadImage(file, folder, fileName);
    url = image.Location;
  }
  
  try {
    await FotoKelas.update({
      name: name,
      description: description,
      clubId: clubId,
      image: fileName,
      url: url
    }, { where: {
        id: req.params.id
      }
    });
    res.status(200).json({
      msg: "Coba Delete Update Image Class Successfuly", 
      error: delImg
    });
  } catch (error) {
    res.status(500).json({msg: error.message})
  }
}

export const deleteFotoKelas = async(req, res) => {
  const classes =  await FotoKelas.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!classes) return res.status(404).json({msg: "Class Image Not Found"});
  try {
    const filePath = `./public/images/foto_kelas/${classes.image}`;
    fs.unlinkSync(filePath);
    // // Delete File in S3
    // const prefix = "fotoKelas/";
    // let keyImage = prefix + classes.image;
    // await deleteImage(keyImage);
    await classes.destroy({
      where: {
        id: classes.id
      }
    });
    res.status(200).json({msg: "Class Image Deletet successfuly"})
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}
