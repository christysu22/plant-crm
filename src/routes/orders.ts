import { Router, Request, Response } from 'express';
import { OrderModel } from '../models/Order';

const router = Router();

// Get all orders
router.get('/', (req: Request, res: Response) => {
  try {
    const orders = OrderModel.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const order = OrderModel.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create new order
router.post('/', (req: Request, res: Response) => {
  try {
    const order = req.body;
    const id = OrderModel.create(order);
    const newOrder = OrderModel.findById(id);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create order' });
  }
});

// Update order
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = OrderModel.update(id, req.body);

    if (!success) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = OrderModel.findById(id);
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update order' });
  }
});

// Delete order
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = OrderModel.delete(id);

    if (!success) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
