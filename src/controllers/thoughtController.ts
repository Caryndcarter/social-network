// ObjectId() method for converting studentId string into an ObjectId for querying database
//import { ObjectId } from 'mongodb';
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
    const { studentId } = req.params;
    try {
        const thought = await Thought.findById(studentId);
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
            User.findByIdAndUpdate
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
    "username": "lernantino",
    "userId": "5edff358a0fcb779aa7b118b"
  }
*/


/**
 * DELETE Thought based on id /thoughts/:id
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
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: 'Thought deleted, but no user found',
            });
        }

        return res.json({ message: 'Thought successfully deleted' });
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
    console.log('You are adding a reaction');
    console.log(req.body);
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res
                .status(404)
                .json({ message: 'No thought found with that ID :(' });
        }

        return res.json(thought);
    } catch (err) {
        return res.status(500).json(err);
    }
}

/**
 * DELETE Reaction based on /thoughts/:thoughtId/reactions
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
                .json({ message: 'No thought found with that ID :(' });
        }

        return res.json(thought);
    } catch (err) {
        return res.status(500).json(err);
    }
}
