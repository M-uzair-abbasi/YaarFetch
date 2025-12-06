import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      pickupLocation,
      deliveryLocation,
      budget,
      deadline,
      specialInstructions,
    } = req.body;

    if (!title || !description || !pickupLocation || !deliveryLocation || !budget) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const order = await prisma.order.create({
      data: {
        creatorId: req.userId!,
        title,
        description,
        pickupLocation,
        deliveryLocation,
        budget: parseFloat(budget),
        deadline: deadline ? new Date(deadline) : null,
        specialInstructions,
        status: 'ACTIVE',
      },
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
    });

    res.status(201).json(order);
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrders = async (req: any, res: Response) => {
  try {
    const { status, campus } = req.query;
    const where: any = {};

    if (status) {
      where.status = status;
    } else {
      where.status = { in: ['ACTIVE', 'MATCHED'] };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        creator: {
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
    let filteredOrders = orders;
    if (campus) {
      filteredOrders = orders.filter(
        (order) => order.creator.campus === campus
      );
    }

    res.json(filteredOrders);
  } catch (error: any) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrder = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        creator: {
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
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error: any) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { creatorId: req.userId },
      include: {
        matches: {
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
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error: any) {
    console.error('Get my orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      pickupLocation,
      deliveryLocation,
      budget,
      deadline,
      specialInstructions,
      status,
    } = req.body;

    // Check if user owns the order
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (existingOrder.creatorId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(pickupLocation && { pickupLocation }),
        ...(deliveryLocation && { deliveryLocation }),
        ...(budget && { budget: parseFloat(budget) }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(specialInstructions !== undefined && { specialInstructions }),
        ...(status && { status }),
      },
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
    });

    res.json(updatedOrder);
  } catch (error: any) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (existingOrder.creatorId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.order.delete({
      where: { id },
    });

    res.json({ message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

