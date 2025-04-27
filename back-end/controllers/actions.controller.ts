import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import asyncHandler from 'express-async-handler';
import { syncUserLevel } from '../utils/userLevel';

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

    syncUserLevel(user);

    await user.save();

    res.status(200).json({ message: 'Action enregistrée avec succès.', user });
  }
);
