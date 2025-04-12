import { Request, Response } from 'express';
import bcrypt from 'bcrypt';// 🔒 Pour hacher les mots de passe
import User from '../models/user';
import jwt from 'jsonwebtoken';

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


// 📌 Connexion d’un utilisateur
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 🔍 Vérifie que l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // 🔐 Compare le mot de passe hashé
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // 🔑 Crée un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' }
    );

    // ✅ Réponse unique
    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error('Erreur connexion :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};