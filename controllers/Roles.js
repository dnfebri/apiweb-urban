import Roles from "../models/RoleModel.js";

export const getRoles = async(req, res) => {
  try {
    const response =  await Roles.findAll({
      attributes:['id', 'name']
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

// export const getRoleById = async(req, res) => {
//   try {
//     const response =  await Roles.findOne({
//       attributes:['id', 'name'],
//       where: {
//         id: req.params.id
//       }
//     });
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({msg: error.message});
//   }
// }

export const createRole = async(req, res) => {
  const {name} = req.body;
  try {
    const save = await Roles.create({
      name: name
    });
    res.status(201).json({msg: "Role berhasil dibuat", data:save});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const updateRole = async(req, res) => {
  const role =  await Roles.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!role) return res.status(404).json({msg: "Role tidak ditemukan"});
  try {
    await Roles.update({
      name: req.body.name
    },{
      where: {
        id: role.id
      }
    });
    console.log(req.body);
    res.status(200).json({msg: "Role Berhasil di update"});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const deleteRole = async(req, res) => {
  const role =  await Roles.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!role) return res.status(404).json({msg: "Role tidak ditemukan"});
  try {
    await Roles.destroy({
      where: {
        id: role.id
      }
    });
    res.status(200).json({msg: "User Deleted"});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}