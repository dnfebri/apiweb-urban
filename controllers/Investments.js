import Investments from "../models/InvestmentModel.js";
import { Op } from "sequelize";

export const getInvestments = async(req, res) => {
  const response =  await Investments.findAll();
  res.status(200).json(response);
}

export const getInvestmentById = async(req, res) => {
  
}

export const createInvestment = async(req, res) => {
  const {
    kode_inves,
    nominal,
    name,
    email,
    phone,
    country,
    city,
    company,
    job,
    industry
  } = req.body;

  const invest = await Investments.findOne({
    where: {
      [Op.or]: [
        {email: email},
        {phone: phone}
      ]
    }
  });
  if (invest) return res.status(500).json({msg: "Email Or Phone is already exists"});

  try {
    await Investments.create({
      kode_inves,
      nominal,
      name,
      email,
      phone,
      country,
      city,
      company,
      job,
      industry
    });
    res.status(201).json({msg: 'Data berhasih di simpan'});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const updateInvestment = async(req, res) => {
  
}

export const deleteInvestment = async(req, res) => {
  
}