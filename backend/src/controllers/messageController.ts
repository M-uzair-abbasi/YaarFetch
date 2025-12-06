import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId, content } = req.body;

    if (!matchId || !content) {
      return res.status(400).json({ error: 'Match ID and content are required' });
    }

    // Verify user is part of the match
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

    const isOrderCreator = match.order.creatorId === req.userId;
    const isDeliverer = match.offer.delivererId === req.userId;

    if (!isOrderCreator && !isDeliverer) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        matchId,
        senderId: req.userId!,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePic: true,
          },
        },
      },
    });

    // Emit socket event
    const io = (req.app.get('io') as any);
    if (io) {
      io.to(`match-${matchId}`).emit('new-message', message);
    }

    res.status(201).json(message);
  } catch (error: any) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId } = req.params;

    // Verify user is part of the match
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

    const isOrderCreator = match.order.creatorId === req.userId;
    const isDeliverer = match.offer.delivererId === req.userId;

    if (!isOrderCreator && !isDeliverer) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const messages = await prisma.message.findMany({
      where: { matchId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePic: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(messages);
  } catch (error: any) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

