import SuccessStory from "../models/SuccessStoryModel.js";
import path from "path";
import fs from "fs";

export const getSuccessStorys = async(req, res) => {
  try {
    const response = await SuccessStory.findAll({
      attributes:['id', 'name', 'image', 'url', 'description']
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const getSuccessStoryById = async(req, res) => {
  try {
    const response =  await SuccessStory.findOne({
      attributes:['id', 'name', 'image', 'url', 'description'],
      where: {
        id: req.params.id
      }
    });
    if (!response) return res.status(404).json({msg: "Story Not Found"});
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const createSuccessStory = (req, res) => {
  const { description } = req.body;
  if(req.files === null) return res.status(422).json({msg: "No file Uploaded"});
  const name = req.body.name;
  const file = req.files.image;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = name.split(' ').join('_') + '-' + file.md5.toString(36).substring(0, 3) + ext;
  const url = `${req.protocol}://${req.get("host")}/images/success_story/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
  if(fileSize > 3000000) return res.status(422).json({msg: "Image must be less than 3 Mb"});

  file.mv(`./public/images/success_story/${fileName}`, async(err) => {
    if(err) return res.status(500).json({msg: err.message});
    try {
      await SuccessStory.create({
        name: name,
        image: fileName,
        url: url,
        description: description
      });
      res.status(201).json({msg: "Success Story Created Successfuly"});
    } catch (error) {
      res.status(500).json(error.message);
      
    }
  });
}

export const updateSuccessStory = async(req, res) => {
  const story =  await SuccessStory.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!story) return res.status(404).json({msg: "Success Story Not Found"});
  
  const { name, description } = req.body;
  let delImg = null;
  let fileName = "";
  if(req.files === null) {
    fileName = story.image;
  } else {
    const file = req.files.image;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = name.split(' ').join('_') + '-' + file.md5.toString(36).substring(0, 3) + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];
  
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 3000000) return res.status(422).json({msg: "Image must be less than 3 Mb"});
    
    const filePath = `./public/images/success_story/${story.image}`;
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      delImg = error.message;
    }
      
    file.mv(`./public/images/success_story/${fileName}`, async(err) => {
      if(err) return res.status(500).json({msg: err.message});
    });
  }
  const url = `${req.protocol}://${req.get("host")}/images/success_story/${fileName}`;
  
  try {
    await SuccessStory.update({
      name: name,
      image: fileName,
      url: url,
      description: description
    }, { where: {
        id: req.params.id
      }
    });
    res.status(200).json({
      msg: "Success Story Updated Successfuly", 
      error: delImg
    });
  } catch (error) {
    res.status(500).json({msg: error.message})
  }
}

export const deleteSuccessStory = async(req, res) => {
  const story =  await SuccessStory.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!story) return res.status(404).json({msg: "Success Story Not Found"});
  try {
    const filePath = `./public/images/success_story/${story.image}`;
    fs.unlinkSync(filePath);
    await story.destroy({
      where: {
        id: story.id
      }
    });
    res.status(200).json({msg: "Success Story Deletet successfuly"})
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}