import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId, revieweeId, rating, comment } = req.body;

    if (!matchId || !revieweeId || !rating) {
      return res.status(400).json({ error: 'Match ID, reviewee ID, and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Verify match exists and user is part of it
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        order: true,
        offer: true,
      },
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Check if match is completed
    if (match.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Can only review completed matches' });
    }

    // Verify reviewee is the other party in the match
    const isOrderCreator = match.order.creatorId === req.userId;
    const isDeliverer = match.offer.delivererId === req.userId;

    if (!isOrderCreator && !isDeliverer) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const expectedRevieweeId = isOrderCreator ? match.offer.delivererId : match.order.creatorId;
    if (revieweeId !== expectedRevieweeId) {
      return res.status(400).json({ error: 'Invalid reviewee ID' });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        matchId_reviewerId: {
          matchId,
          reviewerId: req.userId!,
        },
      },
    });

    if (existingReview) {
      return res.status(400).json({ error: 'Review already exists for this match' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        matchId,
        reviewerId: req.userId!,
        revieweeId,
        rating: parseInt(rating),
        comment,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            profilePic: true,
          },
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            profilePic: true,
          },
        },
      },
    });

    // Update user rating
    const allReviews = await prisma.review.findMany({
      where: { revieweeId },
      select: { rating: true },
    });

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.user.update({
      where: { id: revieweeId },
      data: { rating: averageRating },
    });

    res.status(201).json(review);
  } catch (error: any) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReviews = async (req: any, res: Response) => {
  try {
    const { userId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            profilePic: true,
          },
        },
        match: {
          include: {
            order: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews);
  } catch (error: any) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReview = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            profilePic: true,
          },
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            profilePic: true,
          },
        },
        match: {
          include: {
            order: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (error: any) {
    console.error('Get review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

