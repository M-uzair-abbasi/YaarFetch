import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';
import { Express } from 'express';

export const createMatch = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, offerId } = req.body;

    if (!orderId || !offerId) {
      return res.status(400).json({ error: 'Order ID and Offer ID are required' });
    }

    // Check if order exists and user has permission
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if offer exists
    const offer = await prisma.deliveryOffer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Check if match already exists
    const existingMatch = await prisma.match.findFirst({
      where: {
        orderId,
        offerId,
      },
    });

    if (existingMatch) {
      return res.status(400).json({ error: 'Match already exists' });
    }

    // Create match
    const match = await prisma.match.create({
      data: {
        orderId,
        offerId,
        status: 'PENDING',
        matchedAt: new Date(),
      },
      include: {
        order: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                rating: true,
              },
            },
          },
        },
        offer: {
          include: {
            deliverer: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                rating: true,
              },
            },
          },
        },
      },
    });

    // Update order status to MATCHED
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'MATCHED' },
    });

    // Update offer status to IN_PROGRESS
    await prisma.deliveryOffer.update({
      where: { id: offerId },
      data: { status: 'IN_PROGRESS' },
    });

    // Emit socket event
    const io = (req.app.get('io') as any);
    if (io) {
      io.to(`match-${match.id}`).emit('match-created', match);
    }

    res.status(201).json(match);
  } catch (error: any) {
    console.error('Create match error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMatches = async (req: AuthRequest, res: Response) => {
  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { order: { creatorId: req.userId } },
          { offer: { delivererId: req.userId } },
        ],
      },
      include: {
        order: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                rating: true,
              },
            },
          },
        },
        offer: {
          include: {
            deliverer: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                rating: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(matches);
  } catch (error: any) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMatch = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                rating: true,
                phone: true,
              },
            },
          },
        },
        offer: {
          include: {
            deliverer: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                rating: true,
                phone: true,
              },
            },
          },
        },
        messages: {
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
        },
      },
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json(match);
  } catch (error: any) {
    console.error('Get match error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMatchesForOrder = async (req: any, res: Response) => {
  try {
    const { orderId } = req.params;

    const matches = await prisma.match.findMany({
      where: { orderId },
      include: {
        offer: {
          include: {
            deliverer: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                rating: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(matches);
  } catch (error: any) {
    console.error('Get matches for order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMatchesForOffer = async (req: any, res: Response) => {
  try {
    const { offerId } = req.params;

    const matches = await prisma.match.findMany({
      where: { offerId },
      include: {
        order: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                rating: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(matches);
  } catch (error: any) {
    console.error('Get matches for offer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateMatchStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    // Get match
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        order: true,
        offer: true,
      },
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Check authorization
    const isOrderCreator = match.order.creatorId === req.userId;
    const isDeliverer = match.offer.delivererId === req.userId;

    if (!isOrderCreator && !isDeliverer) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update match status
    const updatedMatch = await prisma.match.update({
      where: { id },
      data: {
        status,
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
      },
      include: {
        order: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                rating: true,
              },
            },
          },
        },
        offer: {
          include: {
            deliverer: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                rating: true,
              },
            },
          },
        },
      },
    });

    // Update order and offer status if match is completed
    if (status === 'COMPLETED') {
      await prisma.order.update({
        where: { id: match.orderId },
        data: { status: 'COMPLETED' },
      });

      await prisma.deliveryOffer.update({
        where: { id: match.offerId },
        data: { status: 'COMPLETED' },
      });
    }

    // Emit socket event
    const io = (req.app.get('io') as any);
    if (io) {
      io.to(`match-${id}`).emit('match-status-updated', updatedMatch);
    }

    res.json(updatedMatch);
  } catch (error: any) {
    console.error('Update match status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

