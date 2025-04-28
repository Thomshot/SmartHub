import { Request, Response } from 'express'; // Ensure these are imported from 'express'
import mongoose from 'mongoose';
import Device from '../models/device';
import User, { IUser } from '../models/user';
import nodemailer from 'nodemailer';
import { IDevice } from '../models/device';

// Méthode pour rechercher un appareil
export const searchDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query; // Extract the search query from the request
    if (!query) {
      res.status(400).json({ message: 'La requête de recherche est vide.' });
      return;
    }

    // Perform a case-insensitive search in the database
    const devices = await Device.find({
      nom: { $regex: query, $options: 'i' }
    });

    res.status(200).json(devices); // Return the search results
  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Méthode pour créer un nouvel appareil
export const createDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const deviceData = req.body; // Récupère les données envoyées dans la requête

    // Crée un nouvel objet Device
    const newDevice = new Device(deviceData);

    // Sauvegarde dans la base de données
    const savedDevice = await newDevice.save();

    res.status(201).json({
      message: 'Objet créé avec succès',
      device: savedDevice,
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'objet :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'objet.', error });
  }
};

// Méthode pour récupérer tous les objets
export const getAllDevices = async (req: Request, res: Response): Promise<void> => {
  try {
    const devices = await Device.find(); // Récupère tous les objets dans la BDD
    res.status(200).json(devices); // Retourne les objets
  } catch (error) {
    console.error('Erreur lors de la récupération des objets :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

export const requestDeleteDevice = async (req: Request, res: Response): Promise<void> => {
  const { deviceId, userId, deviceName } = req.body;

  try {
    // 1️⃣ Vérifier que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user){
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }

    // 2️⃣ Retirer l'objet de la maison de l'utilisateur si présent
    const deviceIndex = user.userDevices.findIndex(
      (ud: any) => ud.device.toString() === deviceId
    );
    if (deviceIndex > -1) {
      user.userDevices.splice(deviceIndex, 1);
      await user.save();
    }

    // 3️⃣ Trouver les administrateurs
    const admins = await User.find({ userType: 'administrateur' });
    if (!admins || admins.length === 0) {
      res.status(404).json({ message: 'Aucun administrateur trouvé.' });
      return;
    }

    // 4️⃣ Envoyer le mail de demande aux admins
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const toEmails = admins.map(a => a.email).join(',');
    const mailOptions = {
      from: '"SmartHub" <no-reply@smarthub.com>',
      to: toEmails,
      subject: 'Demande de suppression d\'objet',
      html: `
        <p>L'utilisateur <b>${user.firstName} ${user.lastName}</b> (${user.email}) demande la suppression de l’objet <b>${deviceName}</b> (ID : ${deviceId}).</p>
        <p>Merci de vous connecter à la plateforme pour valider ou refuser la suppression.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Demande envoyée à l'administrateur et objet retiré de votre maison (si présent)."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la demande.' });
  }
};

export const updateDeviceStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const deviceId = req.params.deviceId;
    const { status } = req.body;

    const user = await User.findById(userId).populate('userDevices.device');
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé." });
      return;
    }
    const userDevice = user.userDevices.find(
      (ud: any) => ud.device._id.toString() === deviceId
    );
    if (!userDevice) {
      res.status(404).json({ message: "Device non trouvé dans la maison de l'utilisateur." });
      return;
    }
    userDevice.statutActuel = status;
    await user.save();
    res.json({ message: 'Statut mis à jour pour ce device chez cet utilisateur.', userDevice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

export const clearUserDevices = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user){
    res.status(404).json({ message: "Utilisateur non trouvé." });
    return;
  }

  user.userDevices.splice(0, user.userDevices.length);
  await user.save();

  res.json({ message: "Tous les objets ont été retirés de la maison de l'utilisateur." });
};


export const updateUserDeviceName = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const deviceId = req.params.deviceId;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      res.status(400).json({ message: "Le nom du device est requis." });
      return;
    }

    // ➔ Pas besoin de populate ici
    const user = await User.findById(userId) as IUser;
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé." });
      return;
    }

    // ➔ userDevices contient des objets internes maintenant (pas des références ObjectId)
    const userDevice = user.userDevices.find((ud) =>
      ud.device &&
      typeof ud.device === 'object' &&
      '_id' in ud.device &&
      (ud.device as any)._id.toString() === deviceId
    );

    if (!userDevice) {
      res.status(404).json({ message: "Device non trouvé dans la maison de l'utilisateur." });
      return;
    }

    // ➔ Modifier directement l'objet device stocké dans user
    (userDevice.device as any).nom = name;

    await user.save();

    res.status(200).json({ message: "Nom du device lié à l'utilisateur mis à jour avec succès.", device: userDevice.device });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


