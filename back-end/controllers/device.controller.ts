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

export const createDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const deviceData = req.body;
    if (!deviceData.nom || !deviceData.type || !deviceData.room) {
      res.status(400).json({ message: "Champs obligatoires manquants (nom, type, room)." });
      return;
    }

    const newDevice = new Device(deviceData);
    const savedDevice = await newDevice.save();

    res.status(201).json({
      message: 'Objet créé avec succès',
      device: savedDevice,
    });
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'objet :', error.message);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'objet.', error: error.message });
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
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }

    // ✅ Comparer avec userDevice._id
    const deviceIndex = user.userDevices.findIndex(
      (ud: any) => ud._id.toString() === deviceId
    );

    if (deviceIndex > -1) {
      user.userDevices.splice(deviceIndex, 1);
      await user.save();
    }

    // Email aux administrateurs
    const admins = await User.find({ userType: 'administrateur' });
    if (!admins || admins.length === 0) {
      res.status(404).json({ message: 'Aucun administrateur trouvé.' });
      return;
    }

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
      message: "✅ Demande envoyée à l'administrateur et objet retiré de votre maison (si présent)."
    });

  } catch (error) {
    console.error('❌ Erreur requestDeleteDevice :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la demande.' });
  }
};

export const updateDeviceStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const userDeviceId = req.params.deviceId; // ici deviceId est en fait userDeviceId
    const { status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé." });
      return;
    }

    // Ici on cherche sur userDevices._id, PAS device._id
    const userDevice = user.userDevices.find(
      (ud: any) => ud._id.toString() === userDeviceId
    );

    if (!userDevice) {
      res.status(404).json({ message: "Device non trouvé dans la maison de l'utilisateur." });
      return;
    }

    userDevice.statutActuel = status;
    await user.save();

    res.json({ message: '✅ Statut mis à jour pour ce device dans la maison.', userDevice });
  } catch (err) {
    console.error('❌ Erreur updateDeviceStatus :', err);
    res.status(500).json({ message: 'Erreur serveur interne.' });
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
    const userDeviceId = req.params.userDeviceId;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      res.status(400).json({ message: "Le nom du device est requis." });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé." });
      return;
    }
    console.log("📥 Tous les userDevices de l'utilisateur :", user.userDevices.map((ud: any) => ud._id?.toString()));
    console.log("🔍 userDeviceId reçu :", userDeviceId);

    const userDevice = user.userDevices.find((ud: any) => ud._id?.toString() === userDeviceId);
    if (!userDevice) {
      res.status(404).json({ message: "Device non trouvé dans la maison de l'utilisateur." });
      return;
    }

    if (userDevice.device && typeof userDevice.device === 'object') {
      userDevice.device.nom = name;
    }

    await user.save();

    res.status(200).json({
      message: "Nom du device lié à l'utilisateur mis à jour avec succès.",
      device: userDevice.device
    });
  } catch (error) {
    console.error('Erreur updateUserDeviceName:', error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

export const addDeviceToUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const { deviceId } = req.body;

    // 1. Trouver le Device à cloner
    const device = await Device.findById(deviceId);
    if (!device) {
      res.status(404).json({ message: 'Device not found' });
      return;
    }

    // 2. Trouver l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé." });
      return;
    }

    // 3. Vérifier si déjà présent
    const alreadyExists = user.userDevices.some((ud) =>
      (ud.device as any).idUnique === device.idUnique
    );

    if (alreadyExists) {
      res.status(400).json({ message: "Device déjà présent chez l'utilisateur." });
      return;
    }

    // 4. Ajouter une copie complète du device
    user.userDevices.push({
      device: {
        idUnique: device.idUnique,
        nom: device.nom,
        type: device.type,
        statutActuel: device.statutActuel,
        connectivite: device.connectivite,
        etatBatterie: device.etatBatterie,
        ip: device.ip,
        mac: device.mac,
        protocol: device.protocol,
        brand: device.brand,
        room: device.room,
        image: device.image,
        derniereInteraction: device.derniereInteraction,
        resolution: device.resolution,
        temperatureActuelle: device.temperatureActuelle,
        temperatureCible: device.temperatureCible,
        mode: device.mode,
        couleurActuelle: device.couleurActuelle,
        luminosite: device.luminosite,
        consommationActuelle: device.consommationActuelle,
        niveauBatterie: device.niveauBatterie,
        humidite: device.humidite,
        volumeActuel: device.volumeActuel,
      },
      statutActuel: device.statutActuel,
    });

    await user.save();

    const lastDevice = user.userDevices[user.userDevices.length - 1];

    res.status(200).json({
      message: "✅ Device ajouté à la maison de l'utilisateur",
      device: lastDevice.device,
    });

  } catch (error) {
    console.error('❌ Erreur lors de l’ajout du device à l’utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


