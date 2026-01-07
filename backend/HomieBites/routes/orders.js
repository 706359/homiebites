import express from "express";
import multer from "multer";
import * as ordersController from "../controllers/ordersController.js";
import {
  deleteOrder,
  updateOrder,
} from "../controllers/orderUpdateController.js";
import { uploadExcel } from "../controllers/uploadExcelController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Get all orders (admin only)
router.get("/", authenticate, isAdmin, ordersController.getAllOrders);

// Get user's orders
router.get("/my-orders", authenticate, ordersController.getMyOrders);

// Create new order (admin only)
router.post("/", authenticate, isAdmin, ordersController.createOrder);

// Create new order manually (admin only) - with new OrderID format
router.post(
  "/manual",
  authenticate,
  isAdmin,
  ordersController.createManualOrder,
);

// Bulk import orders (admin only)
router.post(
  "/bulk-import",
  authenticate,
  isAdmin,
  ordersController.bulkImportOrders,
);

// Cleanup duplicate orders (admin only)
router.post(
  "/cleanup-duplicates",
  authenticate,
  isAdmin,
  ordersController.cleanupDuplicates,
);

// Upload Excel file and import orders (admin only)
router.post(
  "/upload-excel",
  authenticate,
  isAdmin,
  upload.single("file"),
  uploadExcel,
);

// Clear all orders (admin only) - MUST be before /:id route to avoid route conflict
router.delete(
  "/clear-all",
  authenticate,
  isAdmin,
  ordersController.clearAllOrders,
);

// Update order (admin only)
router.put("/:id", authenticate, isAdmin, updateOrder);

// Delete order (admin only)
router.delete("/:id", authenticate, isAdmin, deleteOrder);

export default router;
