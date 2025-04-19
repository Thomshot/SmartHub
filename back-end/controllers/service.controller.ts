import { Request, Response } from 'express';
import Service from '../models/service';

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    console.error('Erreur lors de la récupération des services :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

export const searchService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    if (!query) {
      res.status(400).json({ message: 'La requête de recherche est vide.' });
      return;
    }

    const services = await Service.find({
      nom: { $regex: query, $options: 'i' } // ✅ Recherche insensible à la casse
    });

    res.status(200).json(services); // ✅ Retourne les résultats
  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
