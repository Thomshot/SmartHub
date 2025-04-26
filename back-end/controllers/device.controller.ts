import { Request, Response } from 'express'; // Ensure these are imported from 'express'
import mongoose from 'mongoose';
import Device from '../models/device';

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


export const updateDeviceStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceId, newStatus } = req.body;

    // Vérifiez si l'objet existe
    const device = await Device.findById(deviceId);
    if (!device) {
      res.status(404).json({ message: 'Objet non trouvé.' });
      return;
    }

    // Vérifiez si le nouvel état est valide
    if (!device.états.includes(newStatus)) {
      res.status(400).json({ message: 'État invalide.' });
      return;
    }

    // Mettez à jour le statut
    device.statutActuel = newStatus;
    await device.save();

    res.status(200).json({ message: 'Statut mis à jour avec succès.', device });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};