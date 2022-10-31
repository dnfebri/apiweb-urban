import PersonalTraining from "../models/PersonalTrainingModel.js";
import path from "path";
import fs from "fs";
import { deleteImage, uploadImage } from "../helpers/helper.js";

export const getPersonalTrainings = async(req, res) => {
  try {
    const response =  await PersonalTraining.findAll({
      attributes:['id', 'name', 'description', 'clubId', 'image', 'url'],
      order: [
        ['id', 'DESC']
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const getPersonalTrainingById = async(req, res) => {
  try {
    const response =  await PersonalTraining.findOne({
      attributes:['id', 'name', 'description', 'clubId', 'image', 'url'],
      where: {
        id: req.params.id
      }
    });
    if (!response) return res.status(404).json({msg: "Personal Trainer tidak ditemukan"});
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const createPersonalTraining = async(req, res) => {
  const { description, clubId } = req.body;
  if(req.files === null) return res.status(422).json({msg: "No file Uploaded"});
  const name = req.body.name;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
  if(fileSize > 3000000) return res.status(422).json({msg: "Image must be less than 3 Mb"});

  const folder = "personalTraining";
  const fileName = name.split(' ').join('_') + '-' + new Date().getTime() + ext;
  const image = await uploadImage(file, folder, fileName);
  const url = image.Location;

  try {
    await PersonalTraining.create({
      name: name,
      description: description,
      clubId: clubId,
      image: fileName,
      url: url
    });
    res.status(201).json({msg: "Created Personal Trainer Successfuly"});
  } catch (error) {
    res.status(500).json(error.message);
    
  }
}

export const updatePersonalTraining = async(req, res) => {
  const pt =  await PersonalTraining.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!pt) return res.status(404).json({msg: "Personal Trainer Not Found"});
  
  const { name, description, clubId } = req.body;
  let delImg = null;
  let fileName = pt.image;
  let url = pt.url;
  if(req.files) {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const allowedType = ['.png', '.jpg', '.jpeg'];
  
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 3000000) return res.status(422).json({msg: "Image must be less than 3 Mb"});
    
    // Delete File in S3
    const prefix = "personalTraining";
    let keyImage = prefix + '/' + pt.image;
    await deleteImage(keyImage);

    // Save / Upload file to S3
    const folder = prefix;
    fileName = name.split(' ').join('_') + '-' + new Date().getTime() + ext;
    const image = await uploadImage(file, folder, fileName);
    url = image.Location;
  }
  
  try {
    await PersonalTraining.update({
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
      msg: "Updated Personal Trainer Successfuly", 
      error: delImg
    });
  } catch (error) {
    res.status(500).json({msg: error.message})
  }
  
}

export const deletePersonalTraining = async(req, res) => {
  const pt =  await PersonalTraining.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!pt) return res.status(404).json({msg: "Personal Trainer Not Found"});
  try {
    // Delete File in S3
    const prefix = "personalTraining/";
    let keyImage = prefix + pt.image;
    await deleteImage(keyImage);
    await pt.destroy({
      where: {
        id: pt.id
      }
    });
    res.status(200).json({msg: "Deletet Personal Trainer successfuly"})
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
  
}