import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import asyncHandler from 'express-async-handler';

export const recordAction = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId, actionCount } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }

    const points = actionCount * 0.5;
user.points += points;

    user.role = user.points >= 7 ? 'expert' :
                user.points >= 5 ? 'avancé' :
                user.points >= 3 ? 'intermédiaire' : 'débutant';

    user.userType = user.role === 'expert' ? 'administrateur' :
                    user.role === 'avancé' ? 'complexe' : 'simple';

    await user.save();

    res.status(200).json({ message: 'Action enregistrée avec succès.', user });
  }
);
