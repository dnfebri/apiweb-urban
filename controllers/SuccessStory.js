import SuccessStory from "../models/SuccessStoryModel.js";
import path from "path";
import { deleteImage, uploadImage } from "../helpers/helper.js";

export const getSuccessStorys = async(req, res) => {
  try {
    const response = await SuccessStory.findAll({
      attributes:['id', 'name', 'image', 'url', 'description'],
      order: [
        ['id', 'DESC']
      ],
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

export const createSuccessStory = async(req, res) => {
  const { description } = req.body;
  if(req.files === null) return res.status(422).json({msg: "No file Uploaded"});
  const name = req.body.name;
  const file = req.files.image;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const allowedType = ['.png', '.jpg', '.jpeg'];
  
  if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
  if(fileSize > 3000000) return res.status(422).json({msg: "Image must be less than 3 Mb"});
  
  const folder = "success_story";
  const fileName = name.split(' ').join('_') + '-' + new Date().getTime() + ext;
  const image = await uploadImage(file, folder, fileName);
  const url = image.Location;
  
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
  let fileName = story.image;
  let url = story.url;
  if(req.files) {
    const file = req.files.image;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = name.split(' ').join('_') + '-' + file.md5.toString(36).substring(0, 3) + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];
  
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 3000000) return res.status(422).json({msg: "Image must be less than 3 Mb"});
    
    // Delete File in S3
    const prefix = "success_story";
    let keyImage = prefix + '/' + story.image;
    await deleteImage(keyImage);

    // Save / Upload file to S3
    const folder = prefix;
    fileName = name.split(' ').join('_') + '-' + new Date().getTime() + ext;
    const image = await uploadImage(file, folder, fileName);
    url = image.Location;
  }
  
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
    // Delete File in S3
    const prefix = "success_story/";
    let keyImage = prefix + story.image;
    await deleteImage(keyImage);
    await SuccessStory.destroy({
      where: {
        id: story.id
      }
    });
    res.status(200).json({msg: "Success Story Deletet successfuly"})
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}