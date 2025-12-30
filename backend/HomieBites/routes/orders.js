import express from 'express';
import multer from 'multer';
import * as ordersController from '../controllers/ordersController.js';
import { deleteOrder, updateOrder } from '../controllers/orderUpdateController.js';
import { uploadExcel } from '../controllers/uploadExcelController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Get all orders (admin only)
router.get('/', authenticate, isAdmin, ordersController.getAllOrders);

// Get user's orders
router.get('/my-orders', authenticate, ordersController.getMyOrders);

// Create new order (admin only)
router.post('/', authenticate, isAdmin, ordersController.createOrder);

// Bulk import orders (admin only)
router.post('/bulk-import', authenticate, isAdmin, ordersController.bulkImportOrders);

// Upload Excel file and import orders (admin only)
router.post('/upload-excel', authenticate, isAdmin, upload.single('file'), uploadExcel);

// Update order (admin only)
router.put('/:id', authenticate, isAdmin, updateOrder);

// Delete order (admin only)
router.delete('/:id', authenticate, isAdmin, deleteOrder);

export default router;
