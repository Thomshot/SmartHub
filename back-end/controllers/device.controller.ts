import { Request, Response } from 'express'; // Ensure these are imported from 'express'
import mongoose from 'mongoose';
import Device from '../models/device';
import User from '../models/user';
import nodemailer from 'nodemailer';
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
    // Trouver l’utilisateur qui fait la demande
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }

    const admins = await User.find({ userType: 'administrateur' });
    if (!admins || admins.length === 0) {
      res.status(404).json({ message: 'Aucun administrateur trouvé.' });
      return;
    }

    // Configuration du transporteur email (adapté pour Gmail)
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
      to: toEmails, // une chaîne séparée par des virgules
      subject: 'Demande de suppression d\'objet',
      html: `
        <p>L'utilisateur <b>${user.firstName} ${user.lastName}</b> (${user.email}) demande la suppression de l’objet <b>${deviceName}</b> (ID : ${deviceId}).</p>
        <p>Merci de vous connecter à la plateforme pour valider ou refuser la suppression.</p>
      `,
    };

    // Envoi du mail
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Demande envoyée à l'administrateur." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la demande.' });
  }
};


// Met à jour le statut d'un appareil via l'URL
export const updateDeviceStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const deviceId = req.params.id; // <-- On prend l'id dans l'URL !
    const { status } = req.body;    // <-- On prend 'status' dans le body

    // Vérifier si l'objet existe
    const device = await Device.findById(deviceId);
    if (!device) {
      res.status(404).json({ message: 'Objet non trouvé.' });
      return;
    }

    // Mettre à jour le statut
    device.statutActuel = status;
    await device.save();

    res.status(200).json({ message: 'Statut mis à jour avec succès.', device });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

export const updateDeviceName = async (req: Request, res: Response): Promise<void> => {
  try {
    const deviceId = req.params.id;
    const { name } = req.body;

    const device = await Device.findById(deviceId);
    if (!device) {
      res.status(404).json({ message: 'Objet non trouvé.' });
      return;
    }

    device.nom = name;
    await device.save();

    res.status(200).json({ message: 'Nom mis à jour avec succès.', device });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du nom :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
