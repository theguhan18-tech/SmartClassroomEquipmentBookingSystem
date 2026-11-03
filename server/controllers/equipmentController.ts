import { Request, Response } from 'express';
import { dbStore, IEquipment } from '../db/store.js';

export const getEquipment = (req: Request, res: Response) => {
  try {
    const { search, category, location, status } = req.query;
    let list = dbStore.getAllEquipment();

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(e => 
        e.name.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q) ||
        (e.modelNumber && e.modelNumber.toLowerCase().includes(q))
      );
    }

    if (category && typeof category === 'string' && category !== 'All') {
      list = list.filter(e => e.category === category);
    }

    if (location && typeof location === 'string' && location !== 'All') {
      list = list.filter(e => e.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (status && typeof status === 'string' && status !== 'All') {
      list = list.filter(e => e.status === status);
    }

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch equipment catalog.' });
  }
};

export const getEquipmentById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = dbStore.findEquipmentById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Equipment not found.' });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Error fetching equipment by id:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve equipment details.' });
  }
};

export const checkAvailability = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, quantity } = req.query;

    const item = dbStore.findEquipmentById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Equipment not found.' });
    }

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Date, start time, and end time are required to check availability.',
      });
    }

    const requestedQty = quantity ? parseInt(quantity as string, 10) : 1;
    if (isNaN(requestedQty) || requestedQty <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive integer.' });
    }

    const availability = dbStore.getEquipmentAvailability(
      id,
      date as string,
      startTime as string,
      endTime as string
    );

    const canAccommodate = availability.availableQuantity >= requestedQty;

    return res.status(200).json({
      success: true,
      data: {
        ...availability,
        requestedQuantity: requestedQty,
        canFulfillRequest: canAccommodate,
      },
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate equipment availability.' });
  }
};

export const createEquipment = (req: Request, res: Response) => {
  try {
    const { name, category, description, image, totalQuantity, location, condition, status, modelNumber, specifications } = req.body;

    if (!name || !category || !totalQuantity || !location) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, total quantity, and location are required fields.',
      });
    }

    const qty = parseInt(totalQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Total quantity must be a positive integer.' });
    }

    const now = new Date().toISOString();
    const newItem: IEquipment = {
      id: 'eq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: name.trim(),
      category,
      description: description?.trim() || '',
      image: image?.trim() || '/src/assets/images/equipment_laser_projector_1793676017444.jpg',
      totalQuantity: qty,
      availableQuantity: qty,
      location: location.trim(),
      condition: condition || 'Good',
      status: status || 'Available',
      modelNumber: modelNumber?.trim(),
      specifications: Array.isArray(specifications) ? specifications : [],
      createdAt: now,
      updatedAt: now,
    };

    dbStore.createEquipment(newItem);

    return res.status(201).json({
      success: true,
      message: 'Equipment created successfully.',
      data: newItem,
    });
  } catch (error) {
    console.error('Error creating equipment:', error);
    return res.status(500).json({ success: false, message: 'Failed to register new equipment.' });
  }
};

export const updateEquipment = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = dbStore.findEquipmentById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Equipment not found.' });
    }

    const { totalQuantity, ...otherUpdates } = req.body;
    let qty = existing.totalQuantity;

    if (totalQuantity !== undefined) {
      qty = parseInt(totalQuantity, 10);
      if (isNaN(qty) || qty < 0) {
        return res.status(400).json({ success: false, message: 'Total quantity must be a non-negative number.' });
      }
    }

    const updated = dbStore.updateEquipment(id, {
      ...otherUpdates,
      totalQuantity: qty,
    });

    return res.status(200).json({
      success: true,
      message: 'Equipment updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating equipment:', error);
    return res.status(500).json({ success: false, message: 'Failed to update equipment.' });
  }
};

export const deleteEquipment = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = dbStore.findEquipmentById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Equipment not found.' });
    }

    // Check if there are active bookings
    const activeBookings = dbStore.getAllBookings().filter(
      b => b.equipmentId === id && (b.status === 'pending' || b.status === 'approved')
    );

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete equipment with ${activeBookings.length} active (pending or approved) reservation(s). Cancel or resolve them first.`,
      });
    }

    dbStore.deleteEquipment(id);

    return res.status(200).json({
      success: true,
      message: 'Equipment deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete equipment.' });
  }
};
