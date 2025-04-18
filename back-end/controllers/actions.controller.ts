import { Request, Response } from 'express';
import User from '../models/user';

export const recordAction = async (req: Request, res: Response) => {
  try {
    const { userId, actionCount } = req.body; // `actionCount` représente le nombre d'actions effectuées
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Mise à jour des points et des actions
    const pointsEarned = actionCount * 0.5; // 0.5 points par action
    user.points += pointsEarned;

    // Vérification du rôle en fonction des points
    if (user.points >= 7) {
      user.role = 'expert';
    } else if (user.points >= 5) {
      user.role = 'avancé';
    } else if (user.points >= 3) {
      user.role = 'intermédiaire';
    } else {
      user.role = 'débutant';
    }

    await user.save();

    res.status(200).json({ message: 'Action enregistrée avec succès.', user });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'action :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
