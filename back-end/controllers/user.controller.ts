import { Request, Response, RequestHandler } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';


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

// ✏️ Mise à jour du profil
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

    // Hash du mot de passe si fourni
    if (req.body.password && req.body.password.trim() !== "") {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(req.body.password, saltRounds);
    }
    if (req.file) {
      updateData.photo = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
    if (!updatedUser) {
      res.json({ message: 'Profil mis à jour avec succès', user: updatedUser });
    }
    res.json({ message: 'Profil mis à jour avec succès', user: updatedUser });
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

export const getUserPoints: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('points'); // 🔥 on récupère uniquement le champ "points"

    if (!user) {
      res.status(404).json({ message: 'Utilisateur introuvable' });
      return;
    }

    res.json({
      points: user.points, 
      pointsMax: 10, 
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des points:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


