import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const createOffer = async (req: AuthRequest, res: Response) => {
  try {
    const {
      departureTime,
      returnTime,
      departureLocation,
      returnLocation,
      maxCapacity,
      serviceFee,
    } = req.body;

    if (
      !departureTime ||
      !returnTime ||
      !departureLocation ||
      !returnLocation
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const offer = await prisma.deliveryOffer.create({
      data: {
        delivererId: req.userId!,
        departureTime: new Date(departureTime),
        returnTime: new Date(returnTime),
        departureLocation,
        returnLocation,
        maxCapacity: maxCapacity || 1,
        serviceFee: serviceFee ? parseFloat(serviceFee) : null,
        status: 'ACTIVE',
      },
      include: {
        deliverer: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            rating: true,
            campus: true,
          },
        },
      },
    });

    res.status(201).json(offer);
  } catch (error: any) {
    console.error('Create offer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOffers = async (req: any, res: Response) => {
  try {
    const { status, campus } = req.query;
    const where: any = {};

    if (status) {
      where.status = status;
    } else {
      where.status = 'ACTIVE';
    }

    const offers = await prisma.deliveryOffer.findMany({
      where,
      include: {
        deliverer: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            rating: true,
            campus: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter by campus if provided
    let filteredOffers = offers;
    if (campus) {
      filteredOffers = offers.filter(
        (offer) => offer.deliverer.campus === campus
      );
    }

    res.json(filteredOffers);
  } catch (error: any) {
    console.error('Get offers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOffer = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const offer = await prisma.deliveryOffer.findUnique({
      where: { id },
      include: {
        deliverer: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            rating: true,
            campus: true,
            phone: true,
          },
        },
        matches: {
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
        },
      },
    });

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.json(offer);
  } catch (error: any) {
    console.error('Get offer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyOffers = async (req: AuthRequest, res: Response) => {
  try {
    const offers = await prisma.deliveryOffer.findMany({
      where: { delivererId: req.userId },
      include: {
        matches: {
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
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(offers);
  } catch (error: any) {
    console.error('Get my offers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOffer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      departureTime,
      returnTime,
      departureLocation,
      returnLocation,
      maxCapacity,
      serviceFee,
      status,
    } = req.body;

    // Check if user owns the offer
    const existingOffer = await prisma.deliveryOffer.findUnique({
      where: { id },
    });

    if (!existingOffer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    if (existingOffer.delivererId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedOffer = await prisma.deliveryOffer.update({
      where: { id },
      data: {
        ...(departureTime && { departureTime: new Date(departureTime) }),
        ...(returnTime && { returnTime: new Date(returnTime) }),
        ...(departureLocation && { departureLocation }),
        ...(returnLocation && { returnLocation }),
        ...(maxCapacity && { maxCapacity: parseInt(maxCapacity) }),
        ...(serviceFee !== undefined && { serviceFee: serviceFee ? parseFloat(serviceFee) : null }),
        ...(status && { status }),
      },
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
    });

    res.json(updatedOffer);
  } catch (error: any) {
    console.error('Update offer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteOffer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingOffer = await prisma.deliveryOffer.findUnique({
      where: { id },
    });

    if (!existingOffer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    if (existingOffer.delivererId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.deliveryOffer.delete({
      where: { id },
    });

    res.json({ message: 'Offer deleted successfully' });
  } catch (error: any) {
    console.error('Delete offer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

