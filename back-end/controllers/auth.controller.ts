import { Request, Response } from 'express';
import bcrypt from 'bcrypt';// 🔒 Pour hacher les mots de passe
import User from '../models/user';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { syncUserLevel } from '../utils/userLevel';
import LoginHistory from '../models/loginHistory'; 



export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, userType = 'simple', ...rest } = req.body; // Default to "simple"

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
      userType, // Assign userType
      verificationToken,
      photo: req.file ? req.file.filename : ''
    });
    await newUser.save();

    const verificationLink = `http://localhost:4200/verify?token=${verificationToken}`;

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

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('⚠️ [DEBUG] Email ou mot de passe manquant');
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    console.log('🔑 [DEBUG] Tentative de connexion avec', email);

    // 🔍 Vérifie que l'utilisateur existe
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ [DEBUG] Utilisateur introuvable pour:', email);
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // ❗ Vérifie si le compte est vérifié
    if (!user.isVerified) {
      console.log('⚠️ [DEBUG] Compte non vérifié pour:', email);
      return res.status(403).json({ message: 'Veuillez confirmer votre compte avant de vous connecter.' });
    }

    // 🔐 Compare le mot de passe hashé
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ [DEBUG] Mauvais mot de passe pour:', email);
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    await LoginHistory.create({
      userId: user._id,
      ipAddress: req.ip || req.connection.remoteAddress
    });

    // Mise à jour des points pour la connexion
    user.points += 0.25;
    syncUserLevel(user);

    try {
      await user.save();
    } catch (saveError) {
      console.error('Erreur lors de la sauvegarde des points ou du niveau:', saveError);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour du compte.' });
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
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        role: user.role,
        points: user.points,
      }
    });

  } catch (error) {
    console.error('Erreur connexion :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
};


export const getLoginHistory = async (req: Request, res: Response) => {
  try {
    const history = await LoginHistory.find().sort({ timestamp: -1 }).populate('userId', 'email firstName lastName');
    res.status(200).json(history);
  } catch (error) {
    console.error('Erreur récupération historique de connexion:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


export const updatePoints = async (req: Request, res: Response) => {
  try {
    const { adminId, userId, points } = req.body;

    // Vérifier si l'utilisateur est un administrateur
    const admin = await User.findById(adminId);
    if (!admin || admin.userType !== 'administrateur') {
      return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs peuvent modifier les points.' });
    }

    // Trouver l'utilisateur cible
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Mettre à jour les points
    user.points += points;
    syncUserLevel(user);

    await user.save();

    res.status(200).json({ message: 'Points mis à jour avec succès.', user });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des points :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
