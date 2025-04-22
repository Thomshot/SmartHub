import { Request, Response } from 'express'; // Ensure these are imported from 'express'
import mongoose from 'mongoose';
import Device from '../models/device';

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

export const createDevice = async (req: Request, res: Response) => {
  try {
    console.log('📥 Requête reçue pour créer un objet :', req.body);

    // Vérifiez que le champ "type" est fourni
    if (!req.body.type || req.body.type.trim() === '') {
      console.error('❌ Le champ "type" est manquant ou vide.');
      return res.status(400).json({ message: 'Le champ "type" est obligatoire.' });
    }

    // Vérifie si la collection "devices" existe
    if (!mongoose.connection.db) {
      return res.status(500).json({ message: 'Connexion à la base de données non établie.' });
    }
    const collections = await mongoose.connection.db.listCollections({ name: 'devices' }).toArray();
    console.log('📂 Collections existantes :', collections);

    if (collections.length === 0) {
      console.error('❌ La collection "devices" n\'existe pas.');
      return res.status(400).json({ message: 'La collection "devices" n\'existe pas.' });
    }

    const deviceData = req.body;

    // Ajout des champs par défaut
    deviceData.derniereInteraction = new Date();
    deviceData.derniereMiseÀJour = new Date();
    deviceData.etatDeBatterie = deviceData.etatDeBatterie || 'N/A';

    console.log('📦 Données préparées pour l\'insertion :', deviceData);

    const newDevice = new Device(deviceData);
    await newDevice.save();

    console.log('✅ Objet créé avec succès :', newDevice);

    res.status(201).json({ message: 'Objet créé avec succès.', device: newDevice });
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'objet :', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error instanceof Error ? error.message : error });
  }
};

export const getDevices = async (req: Request, res: Response) => {
  try {
    const devices = await Device.find(); // Récupère tous les objets de la collection "devices"
    res.status(200).json(devices);
  } catch (error) {
    console.error('Erreur lors de la récupération des objets :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
