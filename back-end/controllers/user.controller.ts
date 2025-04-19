import { Request, Response } from 'express';
import User from '../models/user';

export const searchUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { login } = req.query; // Extract the login query
    if (!login) {
      res.status(400).json({ message: 'Login is required for the search.' });
      return;
    }

    // Perform a case-insensitive search by login
    const user = await User.findOne({ login: { $regex: `^${login}$`, $options: 'i' } });

    if (!user) {
      res.status(404).json({ message: 'No user found with this login.' });
      return;
    }

    res.status(200).json(user); // Return the user details
  } catch (error) {
    console.error('Error during user search:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
