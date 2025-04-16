import { Request, Response } from 'express';
import bcrypt from 'bcrypt';// 🔒 Pour hacher les mots de passe
import User from '../models/user';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, ...rest } = req.body;

    // 🔍 Vérifie si l'utilisateur existe déjà
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé.' });

    // 🔑 Hash du mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Récupérer le nom du fichier uploadé
    const photoPath = req.file ? req.file.filename : '';

    // 👤 Crée un nouvel utilisateur avec mot de passe hashé
    const newUser = new User({
      ...rest,
      email,
      password: hashedPassword,
      verificationToken,
      photo: req.file ? req.file.filename : ''
    });
    await newUser.save();

    const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"SmartHub" <no-reply@smarthub.com>',
      to: email,
      subject: 'Confirmez votre inscription',
      html: `<p>Bienvenue ! Cliquez sur le lien ci-dessous pour valider votre compte :</p>
             <a href="${verificationLink}">${verificationLink}</a>`,
    });

    // ✅ Réponse
    res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (error) {
    console.error('Erreur enregistrement :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    if (!token) return res.status(400).json({ message: 'Token manquant.' });

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Lien de vérification invalide." });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Votre compte a été vérifié avec succès." });
  } catch (error) {
    console.error('Erreur vérification email :', error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};



// 📌 Connexion d’un utilisateur
// 📌 Connexion d’un utilisateur
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 🔍 Vérifie que l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // ❗ Vérifie si le compte est vérifié
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Veuillez confirmer votre compte avant de vous connecter.' });
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

    // ✅ Réponse
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
