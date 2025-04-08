import { Request, Response } from 'express';
import User from '../models/user';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, ...rest } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé.' });

    const newUser = new User({ email, password, ...rest });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (error) {
    console.error('Erreur enregistrement :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};