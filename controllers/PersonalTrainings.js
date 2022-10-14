import PersonalTraining from "../models/PersonalTrainingModel.js";
import path from "path";
import fs from "fs";

export const getPersonalTrainings = async(req, res) => {
  try {
    const response =  await PersonalTraining.findAll({
      attributes:['id', 'name', 'description', 'clubId', 'image', 'url']
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

export const createPersonalTraining = (req, res) => {
  console.log(req.files);
  const { description, clubId } = req.body;
  if(req.files === null) return res.status(422).json({msg: "No file Uploaded"});
  const name = req.body.name;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = name.split(' ').join('_') + ext;
  const url = `${req.protocol}://${req.get("host")}/images/personal_training/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if(!allowedType.includes(ext.toLowerCase())) return req.status(422).json({msg: "Invalid Images"});
  if(fileSize > 3000000) return res.status(422).json({msg: "Image must be less than 3 Mb"});

  file.mv(`./public/images/personal_training/${fileName}`, async(err) => {
    if(err) return res.status(500).json({msg: err.message});
    try {
      await PersonalTraining.create({
        name: name,
        description: description,
        clubId: clubId,
        image: fileName,
        url: url
      });
      res.status(201).json({msg: "Personal Trainer Created Successfuly"});
    } catch (error) {
      res.status(500).json(error.mesage);
      
    }
  })
}

export const updatePersonalTraining = (req, res) => {
  
}

export const deletePersonalTraining = (req, res) => {
  
}