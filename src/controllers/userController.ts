import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js';

/**
 * GET All Users /users
 * @returns an array of Users
*/
export const getAllUsers = async(_req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch(error: any){
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * GET User based on id /users/:id
 * @param string id
 * @returns a single User object
*/
export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId).populate("thoughts").populate("friends");
      if(user) {
        res.json(user);
      } else {
        res.status(404).json({
          message: 'User not found'
        });
      }
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };

  /**
 * POST User /users
 * @param object username, email
 * @returns a single User object
*/
export const createUser = async (req: Request, res: Response) => {
    const user = req.body;
    console.log(req.body); 
    try {
      const newUser = await User.create(user);
     
      console.log('Headers:', req.headers);
      console.log('Body (raw):', req.body);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({
        message: error.message
      });
    }
  };

/* 
  ```json
  {
    "username": "lernantino",
    "email": "lernantino@gmail.com"
  }
  ```
*/

/**
 * PUT User based on id /user/:id
 * @param object id, username
 * @returns a single User object
*/
export const updateUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user)
    } catch (error: any) {
      res.status(400).json({
        message: error.message
      });
    }
  };

  /**
 * DELETE User based on id /user/:id
 * @param string id
 * @returns string 
*/
export const deleteUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId});
      
      if(!user) {
        res.status(404).json({
          message: 'No user with that ID'
        });
      } else {
        await Thought.deleteMany({ _id: { $in: user.thoughts } });
        res.json({ message: 'User deleted!' });
      }
      
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };


  export const addFriend = async (req: Request, res: Response) => {

    try {
        const friend = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        );

        if (!friend) {
            return res
                .status(404)
                .json({ message: 'No friend found with that ID :(' });
        }

        return res.json(friend);
    } catch (err) {
        return res.status(500).json(err);
    }
}


export const removeFriend = async (req: Request, res: Response) => {

  try {
      const friend = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { friends: req.params.friendId } },
          { runValidators: true, new: true }
      );

      if (!friend) {
          return res
              .status(404)
              .json({ message: 'No friend found with that ID :(' });
      }

      return res.json(friend);
  } catch (err) {
      return res.status(500).json(err);
  }
}
