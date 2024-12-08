import { User, Thought } from '../models/index.js';
import { Request, Response } from 'express';

/**
 * GET All Thoughts /thoughts
 * @returns an array of Thoughts
*/
export const getAllThoughts = async (_req: Request, res: Response) => {
    try {
        const userThoughts = await Thought.find();

        res.json(userThoughts);
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * GET Thought based on id /thoughts/:id
 * @param string id
 * @returns a single Thought object
*/
export const getThoughtById = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
        const thought = await Thought.findById(thoughtId);
        if (thought) {
            res.json({
                thought
            });
        } else {
            res.status(404).json({
                message: 'Thought not found'
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

/**
 * POST Thought /thoughts
 * @param object thought
 * @returns a single Thought object
*/

export const createThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.create(req.body);
        if(thought){
                 await User.findOneAndUpdate(
                  { _id: req.body.userId},
                  { $push: {thoughts: thought._id} },
                  { runValidators: true, new: true })
        }

        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
}

/*
  // example data
  {
    "thoughtText": "Here's a cool thought...",
    "username": "caryn",
    "userId": "5edff358a0fcb779aa7b118b"
  }
*/

/**
 * PUT Thought /thoughts/:thoughtId
 * @param object thought
 * @returns a single Thought object
*/
export const updateThought = async (req: Request, res: Response) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought)
    } catch (error: any) {
      res.status(400).json({
        message: error.message
      });
    }
  };


/**
 * DELETE Thought based on id /thoughts/:thoughtId
 * @param string id
 * @returns string 
*/
export const deleteThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!thought) {
            return res.status(404).json({ message: 'This thought does not exist' });
        }

        const user = await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId},
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        );

        
        if (!user) {
            return res.status(404).json({
                message: 'Thought deleted, but no user found',
            });
        } 

        return res.json({ message: 'Thought successfully deleted and removed from user' });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

/**
 * POST Reaction based on /thoughts/:thoughtId/reactions
 * @param string id
 * @param object reaction
 * @returns object thought
*/

export const addReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res
                .status(404)
                .json({ message: 'No thought found with that ID' });
        }

        return res.json(thought);
    } catch (err) {
        return res.status(500).json(err);
    }
}

/*
  // example data
  {
    "reactionBody": "LOL"
  }
*/

/**
 * DELETE Reaction based on /thoughts/:thoughtId/reactions/:reactionId
 * @param string reactionId
 * @param string thoughtId
 * @returns object thought
*/

export const removeReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res
                .status(404)
                .json({ message: 'No thought found with that ID' });
        }

        return res.json(thought);
    } catch (err) {
        return res.status(500).json(err);
    }
}
