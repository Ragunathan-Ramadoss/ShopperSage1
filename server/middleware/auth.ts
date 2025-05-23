import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

/**
 * Middleware to authenticate API requests using API key
 */
export const apiKeyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the API key from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'API key is required. Please provide a valid API key in the Authorization header.',
        code: 'AUTH_NO_API_KEY'
      });
    }
    
    const apiKey = authHeader.split(' ')[1];
    
    if (!apiKey) {
      return res.status(401).json({
        status: 'error',
        message: 'API key is required. Please provide a valid API key in the Authorization header.',
        code: 'AUTH_NO_API_KEY'
      });
    }
    
    // Check if the API key exists and is active
    const apiKeyExists = await storage.getApiKeyByKey(apiKey);
    
    if (!apiKeyExists) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid API key.',
        code: 'AUTH_INVALID_API_KEY'
      });
    }
    
    if (!apiKeyExists.active) {
      return res.status(401).json({
        status: 'error',
        message: 'API key is inactive.',
        code: 'AUTH_INACTIVE_API_KEY'
      });
    }
    
    // API key is valid, proceed to the next middleware/controller
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred during authentication.',
      code: 'AUTH_ERROR'
    });
  }
};
