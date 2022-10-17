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
  const { description, clubId } = req.body;
  if(req.files === null) return res.status(422).json({msg: "No file Uploaded"});
  const name = req.body.name;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = name.split(' ').join('_') + '-' + file.md5.toString(36).substring(0, 3) + ext;
  const url = `${req.protocol}://${req.get("host")}/images/personal_training/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
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
      res.status(500).json(error.message);
      
    }
  })
}

export const updatePersonalTraining = async(req, res) => {
  const pt =  await PersonalTraining.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!pt) return res.status(404).json({msg: "Personal Trainer Not Found"});
  
  const { name, description, clubId } = req.body;
  let fileName = "";
  if(req.files === null) {
    fileName = pt.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = name.split(' ').join('_') + '-' + file.md5.toString(36).substring(0, 3) + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];
  
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 3000000) return res.status(422).json({msg: "Image must be less than 3 Mb"});
    
    const filePath = `./public/images/personal_training/${pt.image}`;
    fs.unlinkSync(filePath);
    
    file.mv(`./public/images/personal_training/${fileName}`, async(err) => {
      if(err) return res.status(500).json({msg: err.message});
    });
  }
  const url = `${req.protocol}://${req.get("host")}/images/personal_training/${fileName}`;
  
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
    res.status(200).json({msg: "Personal Trainer Updated Successfuly"});
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
    const filePath = `./public/images/personal_training/${pt.image}`;
    fs.unlinkSync(filePath);
    await pt.destroy({
      where: {
        id: pt.id
      }
    });
    res.status(200).json({msg: "Personal Trainer Deletet successfuly"})
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
  
}