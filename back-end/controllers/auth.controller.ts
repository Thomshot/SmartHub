import { Request, Response } from 'express';
import bcrypt from 'bcrypt'; // 🔒 Pour hacher les mots de passe
import User from '../models/user';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, ...rest } = req.body;

    // 🔍 Vérifie si l'utilisateur existe déjà
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé.' });

    // 🔑 Hash du mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 👤 Crée un nouvel utilisateur avec mot de passe hashé
    const newUser = new User({ email, password: hashedPassword, ...rest });
    await newUser.save();

    // ✅ Réponse
    res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (error) {
    console.error('Erreur enregistrement :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
