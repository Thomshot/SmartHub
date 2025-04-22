import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';

export const searchUser = async (req: Request, res: Response): Promise<void> => {
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

export const getProfile = async (req: Request, res: Response): Promise<void> => {
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updateData: any = req.body;

    if (req.file) {
      updateData.photo = req.file.filename;
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updated = await User.findByIdAndUpdate(userId, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    console.error('Erreur updateUser:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};