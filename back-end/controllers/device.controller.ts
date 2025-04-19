import { Request, Response } from 'express'; // Ensure these are imported from 'express'
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
