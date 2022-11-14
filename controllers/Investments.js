import Investments from "../models/InvestmentModel.js"

export const getInvestments = async(req, res) => {
  const response =  await Investments.findAll();
  res.status(200).json(response);
}

export const getInvestmentById = async(req, res) => {
  
}

export const createInvestment = async(req, res) => {
  const {
    kode_inves,
    first_name,
    last_name,
    email,
    phone,
    country,
    city,
    company,
    job,
    industry
  } = req.body;

  try {
    await Investments.create({
      kode_inves,
      first_name,
      last_name,
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