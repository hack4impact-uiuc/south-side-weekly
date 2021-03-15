import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { errorWrap } from '../middleware';

import Resource from '../models/resource';

const router = express.Router();

/**
 * Validates an ID to whether or not it is a valid MongoDB ID or not
 * @param id Potential Resource ID to validate
 */
const isValidMongoId = (id: string): boolean => ObjectId.isValid(id);

// Gets all resources
router.get(
  '/',
  errorWrap(async (req: Request, res: Response) => {
    const resources = await Resource.find({});
    res.status(200).json({
      message: `Successfully retrieved all resources.`,
      success: true,
      result: resources,
    });
  }),
);

// Gets resource by id
router.get(
  '/:resourceId',
  errorWrap(async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.resourceId)) {
      res.status(400).json({
        success: false,
        message: 'Bad ID format',
      });
      return;
    }

    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found with id',
      });
    } else {
      res.status(200).json({
        success: true,
        result: resource,
        message: 'Successfully retrieved resource',
      });
    }
  }),
);

// Creates a new resource
router.post(
  '/',
  errorWrap(async (req: Request, res: Response) => {
    const newResource = await Resource.create(req.body);
    if (newResource) {
      res.status(200).json({
        message: 'Successfully created new resource',
        success: true,
        result: newResource,
      });
    }
  }),
);

// Updates a resource
router.put(
  '/:resourceId',
  errorWrap(async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.resourceId)) {
      res.status(400).json({
        success: false,
        message: 'Bad ID format',
      });
      return;
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.resourceId,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedResource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully updated resource',
      result: updatedResource,
    });
  }),
);

// Deletes a resource
router.delete(
  '/:resourceId',
  errorWrap(async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.resourceId)) {
      res.status(400).json({
        success: false,
        message: 'Bad ID format',
      });
      return;
    }

    const deletedResource = await Resource.findByIdAndDelete(
      req.params.resourceId,
    );

    if (!deletedResource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found with id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Resource successfully deleted',
      result: deletedResource,
    });
  }),
);

export default router;
