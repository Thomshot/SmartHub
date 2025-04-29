import { Request, Response, RequestHandler } from 'express';
import LoginHistory from '../models/loginHistory';

export const getLoginHistory: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await LoginHistory.find({ userId })
      .sort({ connectedAt: -1 })
      .limit(50); 

    res.status(200).json(history);
  } catch (error) {
    console.error('Erreur récupération historique connexion:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
