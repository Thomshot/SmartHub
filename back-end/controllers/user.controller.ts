import { Request, Response, RequestHandler } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { syncUserLevel } from '../utils/userLevel';

export const searchUser: RequestHandler = async (req, res) => {
  try {
    const { login } = req.query; // Extract the login query
    if (!login) {
      res.status(400).json({ message: 'Login is required for the search.' });
      return;
    }

    // Perform a case-insensitive search by login
    const user = await User.findOne({ login: { $regex: `^${login}$`, $options: 'i' } });

    if (!user) {
      res.status(404).json({ message: 'No user found with this login.' });
      return;
    }

    res.status(200).json(user); // Return the user details
  } catch (error) {
    console.error('Error during user search:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getProfile: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password -verificationToken');
    if (!user) {
      res.status(404).json({ message: 'Utilisateur introuvable' });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error('Erreur getProfile:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


export const updateUser: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.id;

    // Préparer les champs à mettre à jour
    const updateData: any = {
      gender: req.body.gender,
      birthDate: req.body.birthDate,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      city: req.body.city,
      address: req.body.address,
      email: req.body.email,
      login: req.body.login,
    };

    if (req.body.password && req.body.password.trim() !== "") {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(req.body.password, saltRounds);
    }
    if (req.file) {
      updateData.photo = req.file.filename;
    }
    if (typeof req.body.points === 'number') {
      updateData.points = req.body.points;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    user.set(updateData);    // Met à jour tous les champs, dont les points si présents

    syncUserLevel(user);     // Mets à jour le rôle/niveau à chaque update, peu importe ce qui change

    await user.save();

    const { password, ...safeUser } = user.toObject();

    res.json({ message: 'Profil mis à jour avec succès', user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};