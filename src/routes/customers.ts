import { Router, Request, Response } from 'express';
import { CustomerModel } from '../models/Customer';
import { OrderModel } from '../models/Order';
import { CustomerNoteModel } from '../models/CustomerNote';
import { CustomerTagModel } from '../models/CustomerTag';
import { CustomerFilter } from '../types';

const router = Router();

// Get all customers with optional filtering
router.get('/', (req: Request, res: Response) => {
  try {
    const filter: CustomerFilter = {
      platform: req.query.platform as any,
      is_seller: req.query.is_seller ? req.query.is_seller === 'true' : undefined,
      min_orders: req.query.min_orders ? parseInt(req.query.min_orders as string) : undefined,
      tag: req.query.tag as string,
      search: req.query.search as string,
    };

    const customers = CustomerModel.findAll(filter);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get customer by ID with full details
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const customer = CustomerModel.findById(id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const orders = OrderModel.findByCustomerId(id);
    const notes = CustomerNoteModel.findByCustomerId(id);
    const tags = CustomerTagModel.findByCustomerId(id);

    res.json({
      ...customer,
      orders,
      notes,
      tags,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create new customer
router.post('/', (req: Request, res: Response) => {
  try {
    const customer = req.body;
    const id = CustomerModel.create(customer);
    const newCustomer = CustomerModel.findById(id);
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create customer' });
  }
});

// Update customer
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = CustomerModel.update(id, req.body);

    if (!success) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const updatedCustomer = CustomerModel.findById(id);
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = CustomerModel.delete(id);

    if (!success) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Add tag to customer
router.post('/:id/tags', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { tag } = req.body;

    if (!tag) {
      return res.status(400).json({ error: 'Tag is required' });
    }

    CustomerTagModel.addTag(id, tag);
    const tags = CustomerTagModel.findByCustomerId(id);
    res.json(tags);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add tag' });
  }
});

// Remove tag from customer
router.delete('/:id/tags/:tag', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const tag = req.params.tag;

    const success = CustomerTagModel.removeTag(id, tag);

    if (!success) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove tag' });
  }
});

// Add note to customer
router.post('/:id/notes', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const note = {
      customer_id: id,
      note_type: req.body.note_type,
      content: req.body.content,
    };

    const noteId = CustomerNoteModel.create(note);
    const notes = CustomerNoteModel.findByCustomerId(id);
    res.status(201).json(notes);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add note' });
  }
});

export default router;
