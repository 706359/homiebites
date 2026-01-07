// POST /api/orders/bulk-import (admin) - Bulk import orders (saves directly to MongoDB)
// Rules:
// - If Excel row has Order ID → Backend validates & keeps it
// - If Excel row has NO Order ID → Backend auto-generates
// - Duplicate Order ID → Reject import
export async function bulkImportOrders(req, res) {
  try {
    const ordersData = req.body;

    if (!Array.isArray(ordersData) || ordersData.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No orders provided",
      });
    }

    const imported = [];
    const errors = [];
    const allOrderIds = new Set(); // Track ALL IDs (existing + current batch)

    // Load existing orders from MongoDB
    const existingOrders = await Order.find({}, { orderId: 1 });
    existingOrders.forEach((order) => {
      if (order.orderId) allOrderIds.add(order.orderId);
    });

    console.log(
      `[bulkImportOrders] Starting import of ${ordersData.length} orders. Existing: ${allOrderIds.size}`,
    );

    for (let i = 0; i < ordersData.length; i++) {
      const orderData = ordersData[i];
      try {
        // Normalize Excel fields
        const normalized = {
          sNo: orderData["S No."] || orderData.sNo || orderData.s_no,
          date: orderData.Date || orderData.date,
          deliveryAddress:
            orderData["Delivery Address"] || orderData.deliveryAddress,
          quantity: Number(orderData.Quantity || orderData.quantity) || 1,
          unitPrice:
            Number(orderData["Unit Price"] || orderData.unitPrice) || 0,
          totalAmount:
            Number(orderData["Total Amount"] || orderData.totalAmount) || 0,
          mode: orderData.Mode || orderData.mode || "Lunch",
          status: orderData.Status || orderData.status || "Pending",
          paymentMode:
            orderData["Payment Mode"] || orderData.paymentMode || "Online",
          billingMonth: orderData["Billing Month"] || orderData.billingMonth,
          year: orderData.Year || orderData.year,
          orderId:
            orderData["Order ID"] || orderData.orderId || orderData.order_id,
        };

        // Validate required fields
        if (!normalized.date || !normalized.deliveryAddress) {
          errors.push({
            index: i + 2, // Excel row number (1-indexed + header)
            error: "Missing required: Date or Delivery Address",
            data: orderData,
          });
          continue;
        }

        // Validate Order ID is provided
        const orderId = normalized.orderId
          ? String(normalized.orderId).trim()
          : "";
        if (!orderId) {
          errors.push({
            index: i + 2,
            error: "Missing Order ID",
            data: orderData,
          });
          continue;
        }

        // Check for duplicate Order ID
        if (allOrderIds.has(orderId)) {
          errors.push({
            index: i + 2,
            error: `Duplicate Order ID: ${orderId}`,
            data: orderData,
          });
          continue;
        }

        allOrderIds.add(orderId); // Add to master set

        // Parse date (handle "5-Feb-24" format)
        let parsedDate = normalized.date;
        if (typeof normalized.date === "string") {
          const dateStr = normalized.date.trim();
          // Handle "5-Feb-24" format
          if (dateStr.match(/^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/)) {
            const [day, monthStr, yearStr] = dateStr.split("-");
            const monthNames = [
              "jan",
              "feb",
              "mar",
              "apr",
              "may",
              "jun",
              "jul",
              "aug",
              "sep",
              "oct",
              "nov",
              "dec",
            ];
            const monthIndex = monthNames.findIndex((m) =>
              monthStr.toLowerCase().startsWith(m),
            );
            let year = parseInt(yearStr);
            if (year < 100) year = year < 50 ? 2000 + year : 1900 + year;

            if (monthIndex !== -1) {
              parsedDate = new Date(year, monthIndex, parseInt(day));
            }
          } else {
            parsedDate = new Date(dateStr);
          }
        }

        if (isNaN(parsedDate.getTime())) {
          // Invalid date - keep original string and mark for review
          normalized.dateNeedsReview = true;
          normalized.originalDateString = String(normalized.date);
          // Keep the original date string, don't set to today
          normalized.date = String(normalized.date); // Keep as string
        } else {
          // Valid date - convert to YYYY-MM-DD format
          const year = parsedDate.getFullYear();
          const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
          const day = String(parsedDate.getDate()).padStart(2, "0");
          normalized.date = `${year}-${month}-${day}`;
        }

        // Recalculate total amount (don't trust Excel)
        normalized.totalAmount = normalized.unitPrice * normalized.quantity;

        // Parse billing month if needed
        if (!normalized.billingMonth || !normalized.year) {
          if (
            normalized.billingMonth &&
            normalized.billingMonth.includes("'")
          ) {
            // Parse "Feb'24" format
            const match = normalized.billingMonth.match(/([A-Za-z]+)'(\d{2})/);
            if (match) {
              const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              const monthIndex = monthNames.findIndex(
                (m) => m.toLowerCase() === match[1].toLowerCase(),
              );
              if (monthIndex !== -1) {
                normalized.billingMonth = monthIndex + 1;
                let year = parseInt(match[2]);
                normalized.year = year < 50 ? 2000 + year : 1900 + year;
              }
            }
          }
        }

        // Normalize payment mode
        normalized.paymentMode = normalizePaymentMode(normalized.paymentMode);

        // Determine payment status from status
        if (normalized.status) {
          const statusLower = String(normalized.status).toLowerCase();
          normalized.paymentStatus =
            statusLower === "paid"
              ? "Paid"
              : statusLower === "unpaid"
                ? "Unpaid"
                : "Pending";
        }

        normalized.source = "excel";
        normalized.createdAt = new Date().toISOString();
        normalized.updatedAt = new Date().toISOString();

        imported.push(normalized);
      } catch (error) {
        errors.push({
          index: i + 2,
          error: error.message,
          data: orderData,
        });
      }
    }

    // Save to MongoDB with upsert
    if (imported.length > 0) {
      try {
        const bulkOps = imported.map((order) => {
          const { _id, ...orderData } = order;

          // Convert YYYY-MM-DD date string to Date object in local timezone
          // This prevents timezone shifts when Mongoose saves to MongoDB
          if (
            orderData.date &&
            typeof orderData.date === "string" &&
            orderData.date.match(/^\d{4}-\d{2}-\d{2}$/)
          ) {
            const [year, month, day] = orderData.date.split("-").map(Number);
            orderData.date = new Date(year, month - 1, day); // Create Date in local timezone (month is 0-indexed)
          }

          return {
            updateOne: {
              filter: { orderId: orderData.orderId },
              update: { $set: orderData },
              upsert: true,
            },
          };
        });

        if (bulkOps.length > 0) {
          await Order.bulkWrite(bulkOps, { ordered: false });
          console.log(
            `[bulkImportOrders] Saved ${imported.length} orders to MongoDB`,
          );
        }
      } catch (mongoError) {
        console.error(
          "[bulkImportOrders] MongoDB save failed:",
          mongoError.message,
        );
        throw mongoError;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        imported: imported.length,
        errors: errors.length,
        total: ordersData.length,
        errorDetails: errors,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
// GET /api/orders (admin) - Get all orders from MongoDB
export async function getAllOrders(req, res) {
  try {
    // Load orders directly from MongoDB
    let orders = await Order.find({}).sort({ createdAt: -1 }); // Sort by newest first
    console.log(`[getAllOrders] Found ${orders.length} orders in database`);

    // Normalize orders to ensure consistent field names (handle both old Excel format and new format)
    const normalizedOrders = orders
      .filter((order) => order != null) // Filter out null/undefined orders
      .map((order) => {
        try {
          // Handle both Mongoose documents (from MongoDB) and plain objects
          let normalized;
          if (order && typeof order === "object") {
            // Check if it's a Mongoose document (has toObject method)
            if (typeof order.toObject === "function") {
              try {
                normalized = order.toObject();
              } catch (toObjectError) {
                console.warn(
                  "[getAllOrders] Error calling toObject(), using fallback:",
                  toObjectError.message,
                );
                // Fallback: try to create a plain object copy
                normalized = { ...order };
              }
            } else {
              // For plain objects, use spread operator to create a copy
              normalized = { ...order };
            }
          } else {
            console.warn(
              "[getAllOrders] Invalid order object (not an object):",
              typeof order,
              order,
            );
            return null;
          }

          // Normalize date field (handle multiple formats)
          if (!normalized.date) {
            // Try different field names
            normalized.date =
              normalized.Date ||
              normalized.order_date ||
              normalized.orderDate ||
              normalized.createdAt ||
              new Date();
          }
          if (normalized.Date) delete normalized.Date; // Remove old field

          // Normalize address field
          if (!normalized.deliveryAddress) {
            normalized.deliveryAddress =
              normalized["Delivery Address"] ||
              normalized.delivery_address ||
              normalized.address ||
              "";
          }
          if (normalized["Delivery Address"])
            delete normalized["Delivery Address"];

          // Normalize quantity
          if (!normalized.quantity && normalized.Quantity !== undefined) {
            normalized.quantity = parseInt(normalized.Quantity) || 1;
          }
          if (normalized.Quantity !== undefined) delete normalized.Quantity;

          // Normalize unit price
          if (
            !normalized.unitPrice &&
            (normalized["Unit Price"] !== undefined ||
              normalized.unit_price !== undefined)
          ) {
            normalized.unitPrice =
              parseFloat(normalized["Unit Price"] || normalized.unit_price) ||
              0;
          }
          if (normalized["Unit Price"] !== undefined)
            delete normalized["Unit Price"];
          if (normalized.unit_price !== undefined) delete normalized.unit_price;

          // Normalize total amount
          if (
            !normalized.totalAmount &&
            (normalized["Total Amount"] !== undefined ||
              normalized.total_amount !== undefined)
          ) {
            normalized.totalAmount =
              parseFloat(
                normalized["Total Amount"] || normalized.total_amount,
              ) || 0;
          }
          if (normalized["Total Amount"] !== undefined)
            delete normalized["Total Amount"];
          if (normalized.total_amount !== undefined)
            delete normalized.total_amount;

          // Normalize status
          if (!normalized.status && normalized.Status) {
            normalized.status = normalized.Status;
          }
          if (normalized.Status) delete normalized.Status;
          // Also check paymentStatus
          if (normalized.status && !normalized.paymentStatus) {
            const statusLower = String(normalized.status).toLowerCase();
            if (statusLower === "paid" || statusLower === "delivered") {
              normalized.paymentStatus = "Paid";
            } else if (statusLower === "unpaid") {
              normalized.paymentStatus = "Unpaid";
            } else {
              normalized.paymentStatus = "Pending";
            }
          }

          // Normalize payment mode
          if (
            !normalized.paymentMode &&
            (normalized["Payment Mode"] || normalized.payment_mode)
          ) {
            normalized.paymentMode =
              normalized["Payment Mode"] || normalized.payment_mode;
          }
          if (normalized["Payment Mode"]) delete normalized["Payment Mode"];
          if (normalized.payment_mode) delete normalized.payment_mode;

          // Normalize mode field name (keep original value from Excel, don't convert)
          if (!normalized.mode && normalized["Mode"]) {
            normalized.mode = normalized["Mode"];
          }
          if (normalized["Mode"]) delete normalized["Mode"];
          // Keep mode value as-is from Excel (Lunch, Dinner, Breakfast, Morning, Noon, Night, etc.)

          // Normalize billing month/year if missing
          if (!normalized.billingMonth || !normalized.billingYear) {
            try {
              const orderDate = normalized.date
                ? new Date(normalized.date)
                : new Date();
              if (!isNaN(orderDate.getTime())) {
                normalized.billingMonth = orderDate.getMonth() + 1;
                normalized.billingYear = orderDate.getFullYear();
              }
            } catch (e) {
              // If date parsing fails, try to extract from billing month string
              const billingMonthStr =
                normalized["Billing Month"] || normalized.billing_month;
              if (billingMonthStr) {
                // Try to parse "February'24" format
                const monthMatch = String(billingMonthStr).match(
                  /February|March|April|May|June|July|August|September|October|November|December|January/i,
                );
                if (monthMatch) {
                  const months = [
                    "january",
                    "february",
                    "march",
                    "april",
                    "may",
                    "june",
                    "july",
                    "august",
                    "september",
                    "october",
                    "november",
                    "december",
                  ];
                  normalized.billingMonth =
                    months.indexOf(monthMatch[0].toLowerCase()) + 1;
                  const yearMatch =
                    String(billingMonthStr).match(/'?(\d{2,4})/);
                  if (yearMatch) {
                    let year = parseInt(yearMatch[1]);
                    if (year < 100)
                      year = year < 50 ? 2000 + year : 1900 + year;
                    normalized.billingYear = year;
                  }
                }
              }
            }
          }
          if (normalized["Billing Month"]) delete normalized["Billing Month"];
          if (normalized.billing_month) delete normalized.billing_month;

          // Normalize orderId field (check multiple field name variations)
          // User provides Order ID in Excel, so preserve it
          if (!normalized.orderId) {
            normalized.orderId =
              normalized.order_id ||
              normalized["Order ID"] ||
              normalized["OrderID"] ||
              normalized.id ||
              normalized._id;
          }

          // Clean up alternative field names AFTER extracting to orderId
          // But keep orderId as the primary field
          if (
            normalized.order_id &&
            normalized.order_id !== normalized.orderId
          ) {
            delete normalized.order_id;
          }
          if (
            normalized["Order ID"] &&
            normalized["Order ID"] !== normalized.orderId
          ) {
            delete normalized["Order ID"];
          }
          if (
            normalized["OrderID"] &&
            normalized["OrderID"] !== normalized.orderId
          ) {
            delete normalized["OrderID"];
          }

          // Only generate orderId if still missing (for backward compatibility with old data)
          // New uploads should always have orderId provided in Excel
          if (
            !normalized.orderId ||
            normalized.orderId === "N/A" ||
            normalized.orderId === ""
          ) {
            console.warn(
              "[getAllOrders] Order missing orderId, generating one:",
              normalized,
            );
            const datePart = normalized.date
              ? new Date(normalized.date)
              : new Date();
            const yy = String(datePart.getFullYear()).slice(-2);
            const mm = String(datePart.getMonth() + 1).padStart(2, "0");
            const dd = String(datePart.getDate()).padStart(2, "0");
            const random = Math.random()
              .toString(36)
              .substring(2, 5)
              .toUpperCase();
            normalized.orderId = `HB${yy}${mm}${dd}${random}`;
          }

          // Preserve dateNeedsReview and originalDateString fields (don't normalize them)
          // These are important for showing invalid dates to users
          if (normalized.dateNeedsReview !== undefined) {
            // Keep the flag
          }
          if (normalized.originalDateString !== undefined) {
            // Keep the original invalid date string
          }

          // Convert date strings to Date objects if needed
          // BUT: If dateNeedsReview is true, don't overwrite the date - keep it as is
          if (normalized.dateNeedsReview && normalized.originalDateString) {
            // Keep the original invalid date string - don't replace with today
            normalized.date = normalized.originalDateString;
          } else if (normalized.date && !normalized.dateNeedsReview) {
            if (typeof normalized.date === "string") {
              // Try to parse the date string
              let parsedDate = null;

              // First, try ISO format (most common from JSON serialization)
              if (
                normalized.date.includes("T") ||
                normalized.date.match(/^\d{4}-\d{2}-\d{2}/)
              ) {
                // ISO format: "2024-02-05T00:00:00.000Z" or "2024-02-05"
                parsedDate = new Date(normalized.date);
              }
              // Then try MM/DD/YYYY or DD/MM/YYYY format
              else if (normalized.date.includes("/")) {
                const parts = normalized.date.split("/");
                if (parts.length === 3) {
                  const part1 = parseInt(parts[0]);
                  const part2 = parseInt(parts[1]);
                  const part3 = parseInt(parts[2]);

                  // Try to determine format: if part1 > 12, it's DD/MM/YYYY, else MM/DD/YYYY
                  if (part1 > 12 && part2 <= 12) {
                    // DD/MM/YYYY format
                    parsedDate = new Date(part3, part2 - 1, part1);
                  } else if (part1 <= 12 && part2 <= 31) {
                    // MM/DD/YYYY format
                    parsedDate = new Date(part3, part1 - 1, part2);
                  } else {
                    // Default to MM/DD/YYYY
                    parsedDate = new Date(part3, part1 - 1, part2);
                  }
                } else {
                  parsedDate = new Date(normalized.date);
                }
              }
              // Try DD-MMM-YY format (e.g., "1-Jan-26")
              else if (
                normalized.date.match(/^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/i)
              ) {
                const parts = normalized.date.split("-");
                const day = parseInt(parts[0], 10);
                const monthStr = parts[1].toLowerCase();
                let year = parseInt(parts[2], 10);

                const monthNames = [
                  "jan",
                  "feb",
                  "mar",
                  "apr",
                  "may",
                  "jun",
                  "jul",
                  "aug",
                  "sep",
                  "oct",
                  "nov",
                  "dec",
                ];
                const monthIndex = monthNames.findIndex((m) =>
                  monthStr.startsWith(m),
                );

                if (monthIndex !== -1 && day > 0 && day <= 31) {
                  if (year < 100) {
                    year = year < 50 ? 2000 + year : 1900 + year;
                  }
                  parsedDate = new Date(year, monthIndex, day);
                } else {
                  parsedDate = new Date(normalized.date);
                }
              }
              // Try other formats
              else {
                parsedDate = new Date(normalized.date);
              }

              // Only use parsed date if it's valid
              if (parsedDate && !isNaN(parsedDate.getTime())) {
                // Keep as YYYY-MM-DD string to avoid timezone shifts during JSON serialization
                // Extract date components from the parsed date
                const year = parsedDate.getFullYear();
                const month = String(parsedDate.getMonth() + 1).padStart(
                  2,
                  "0",
                );
                const day = String(parsedDate.getDate()).padStart(2, "0");
                normalized.date = `${year}-${month}-${day}`; // Keep as string, not Date object
              } else {
                // Invalid date - keep original string, don't set to today
                console.warn(
                  `Invalid date format: ${normalized.date}, keeping original string`,
                );
                normalized.date = String(normalized.date); // Keep as string
                normalized.dateNeedsReview = true;
                normalized.originalDateString = String(normalized.date);
              }
            }
            // If date is already a Date object from MongoDB, convert to YYYY-MM-DD string
            else if (normalized.date instanceof Date) {
              if (isNaN(normalized.date.getTime())) {
                // Invalid date - keep as string, don't set to today
                normalized.date = String(normalized.date);
                normalized.dateNeedsReview = true;
                normalized.originalDateString = String(normalized.date);
              } else {
                // Convert Date object to YYYY-MM-DD string to avoid timezone shifts
                const year = normalized.date.getFullYear();
                const month = String(normalized.date.getMonth() + 1).padStart(
                  2,
                  "0",
                );
                const day = String(normalized.date.getDate()).padStart(2, "0");
                normalized.date = `${year}-${month}-${day}`; // Keep as string, not Date object
              }
            }
          } else if (!normalized.date && !normalized.dateNeedsReview) {
            // No date at all and not marked for review - this shouldn't happen, but if it does, mark for review
            console.warn(
              "[getAllOrders] Order missing date and not marked for review:",
              normalized.orderId,
            );
            normalized.dateNeedsReview = true;
            normalized.originalDateString = "MISSING";
            normalized.date = "MISSING";
          }
          // If dateNeedsReview is true, keep the date as is (it's already the original string)

          return normalized;
        } catch (error) {
          console.error(
            "[getAllOrders] Error normalizing order:",
            error.message,
          );
          console.error(
            "[getAllOrders] Order type:",
            typeof order,
            "Has toObject:",
            typeof order?.toObject,
          );
          console.error(
            "[getAllOrders] Order sample:",
            order ? Object.keys(order).slice(0, 5) : "null",
          );
          return null; // Return null for invalid orders, will be filtered out
        }
      })
      .filter((order) => order != null); // Remove any null orders

    console.log(
      `[getAllOrders] Successfully normalized ${normalizedOrders.length} orders`,
    );

    // Deduplicate orders by orderId before sending response
    const seenIds = new Set();
    const deduplicatedOrders = normalizedOrders.filter((order) => {
      const orderId = order.orderId;
      if (!orderId) {
        console.warn("[getAllOrders] Order missing orderId:", order);
        return false; // Skip orders without orderId
      }
      if (seenIds.has(orderId)) {
        console.warn(`[getAllOrders] Duplicate orderId found: ${orderId}`);
        return false; // Skip duplicates
      }
      seenIds.add(orderId);
      return true;
    });

    if (deduplicatedOrders.length !== normalizedOrders.length) {
      console.warn(
        `[getAllOrders] Removed ${normalizedOrders.length - deduplicatedOrders.length} duplicate orders`,
      );
    }

    res.json({ success: true, data: deduplicatedOrders });
  } catch (error) {
    console.error("[getAllOrders] Fatal error:", error);
    console.error("[getAllOrders] Error stack:", error.stack);
    res.status(500).json({ success: false, error: error.message });
  }
}

// GET /api/orders/my-orders - Get orders for the authenticated user
export async function getMyOrders(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId)
      return res.status(401).json({ success: false, error: "Unauthorized" });
    const orders = await Order.find({ user: userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
import Order from "../models/Order.js";

// Utility: Normalize payment mode
const normalizePaymentMode = (pm) => {
  if (!pm) return "Online";
  const s = String(pm).toLowerCase();
  if (s.includes("cash")) return "Cash";
  if (s.includes("upi")) return "UPI";
  if (s.includes("card")) return "Card";
  return "Online";
};

// POST /api/orders (admin) - Create new order manually
export async function createOrder(req, res) {
  try {
    const orderData = req.body;
    if (!orderData.date || !orderData.deliveryAddress) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: date or deliveryAddress",
      });
    }

    // Get default unit price from settings (if available)
    // For now, we'll use the provided unitPrice or 0
    const quantity = Number(orderData.quantity) || 1;
    const unitPrice = Number(orderData.unitPrice) || 0;

    // CRITICAL: totalAmount is ALWAYS calculated on backend (quantity * unitPrice)
    // Never trust totalAmount from request body
    const totalAmount = unitPrice * quantity;

    // Set priceOverride flag if unitPrice differs from default (would need Settings lookup)
    const priceOverride = false; // TODO: Compare with defaultUnitPrice from Settings

    // Remove orderId and totalAmount from body to prevent manual override
    const orderDataWithoutId = { ...orderData };
    delete orderDataWithoutId.orderId;
    delete orderDataWithoutId.totalAmount; // Always calculate on backend

    const order = await Order.create({
      ...orderDataWithoutId,
      quantity,
      unitPrice,
      // totalAmount will be calculated in pre-save hook, but we set it here too
      totalAmount,
      priceOverride,
      paymentMode: normalizePaymentMode(
        orderDataWithoutId.paymentMode || orderDataWithoutId.payment_mode,
      ),
      paymentStatus:
        orderDataWithoutId.paymentStatus ||
        orderDataWithoutId.status ||
        "Pending",
      status: orderDataWithoutId.status || "PENDING", // Legacy field
      source: "manual",
    });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// POST /api/orders/manual (admin) - Create new order manually with new OrderID format
export async function createManualOrder(req, res) {
  try {
    const orderData = req.body;

    // Validate required fields
    if (!orderData.date || !orderData.deliveryAddress) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: date or deliveryAddress",
      });
    }

    // Parse date - handle both Date objects and strings
    let parsedDate = orderData.date;
    if (typeof orderData.date === "string") {
      // Try to parse date string (YYYY-MM-DD format expected from frontend)
      parsedDate = new Date(orderData.date);
      if (isNaN(parsedDate.getTime())) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid date format" });
      }
    }

    // Validate quantity and unit price
    const quantity = Number(orderData.quantity) || 1;
    const unitPrice = Number(orderData.unitPrice) || 0;

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Quantity must be greater than 0" });
    }

    if (unitPrice < 0) {
      return res
        .status(400)
        .json({ success: false, error: "Unit price cannot be negative" });
    }

    // CRITICAL: totalAmount is ALWAYS calculated on backend (quantity * unitPrice)
    const totalAmount = unitPrice * quantity;

    // Remove orderId and totalAmount from body to prevent manual override
    // OrderID will be auto-generated in the pre('validate') hook with new format
    const orderDataWithoutId = { ...orderData };
    delete orderDataWithoutId.orderId;
    delete orderDataWithoutId.totalAmount;

    // Normalize payment status
    let paymentStatus = "Pending";
    if (orderData.paymentStatus) {
      const statusLower = String(orderData.paymentStatus).toLowerCase();
      if (statusLower === "paid") {
        paymentStatus = "Paid";
      } else if (statusLower === "unpaid") {
        paymentStatus = "Unpaid";
      }
    } else if (orderData.status) {
      const statusLower = String(orderData.status).toLowerCase();
      if (statusLower === "paid" || statusLower === "delivered") {
        paymentStatus = "Paid";
      } else if (statusLower === "unpaid") {
        paymentStatus = "Unpaid";
      }
    }

    // Create order - OrderID will be auto-generated in pre('validate') hook
    const order = await Order.create({
      date: parsedDate,
      deliveryAddress: orderData.deliveryAddress,
      quantity,
      unitPrice,
      totalAmount, // Will also be recalculated in pre-save hook
      mode: orderData.mode || "Lunch",
      status: orderData.status || "PENDING",
      paymentMode: normalizePaymentMode(orderData.paymentMode || "Online"),
      paymentStatus,
      source: "manual",
      notes: orderData.notes || "",
    });

    res.status(201).json({
      success: true,
      data: order,
      message: `Order created successfully with ID: ${order.orderId}`,
    });
  } catch (error) {
    console.error("[createManualOrder] Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// POST /api/orders/cleanup-duplicates (admin) - Remove duplicate orders by orderId
export async function cleanupDuplicates(req, res) {
  try {
    // Load all orders from MongoDB
    const allOrders = await Order.find({});
    const seenIds = new Map(); // Use Map to track first occurrence
    const uniqueOrders = [];
    const duplicates = [];
    const duplicateIds = []; // IDs to delete

    allOrders.forEach((order, index) => {
      const orderId = order.orderId;

      if (!orderId) {
        duplicates.push({
          orderId: null,
          reason: "Missing Order ID",
          index,
          _id: order._id,
        });
        duplicateIds.push(order._id);
      } else if (seenIds.has(orderId)) {
        duplicates.push({
          orderId,
          reason: `Duplicate of existing order`,
          index,
          _id: order._id,
        });
        duplicateIds.push(order._id);
      } else {
        seenIds.set(orderId, index + 1); // Store 1-indexed position
        uniqueOrders.push(order);
      }
    });

    if (duplicates.length > 0) {
      // Delete duplicates from MongoDB
      await Order.deleteMany({ _id: { $in: duplicateIds } });
      console.log(
        `[cleanupDuplicates] Removed ${duplicates.length} duplicates`,
      );
    }

    res.json({
      success: true,
      removed: duplicates.length,
      remaining: uniqueOrders.length,
      duplicates: duplicates.slice(0, 10).map((d) => ({
        orderId: d.orderId,
        reason: d.reason,
      })),
    });
  } catch (error) {
    console.error("[cleanupDuplicates] Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// DELETE /api/orders/clear-all (admin) - Delete all orders from MongoDB
export async function clearAllOrders(req, res) {
  try {
    // First, count existing orders
    const beforeCount = await Order.countDocuments({});
    console.log(`[clearAllOrders] Found ${beforeCount} orders before deletion`);

    if (beforeCount === 0) {
      return res.json({
        success: true,
        message: "No orders to delete",
        deletedCount: 0,
        beforeCount: 0,
        afterCount: 0,
      });
    }

    // Delete all orders
    const deleteResult = await Order.deleteMany({});
    const deletedCount = deleteResult.deletedCount || 0;

    // Verify deletion by counting again
    const afterCount = await Order.countDocuments({});
    
    console.log(`[clearAllOrders] Deletion complete:`, {
      beforeCount,
      deletedCount,
      afterCount,
      success: afterCount === 0,
    });

    if (afterCount > 0) {
      console.error(`[clearAllOrders] WARNING: ${afterCount} orders still exist after deletion!`);
      // Try to delete remaining orders
      const secondDelete = await Order.deleteMany({});
      const secondDeletedCount = secondDelete.deletedCount || 0;
      const finalCount = await Order.countDocuments({});
      
      console.log(`[clearAllOrders] Second deletion attempt:`, {
        secondDeletedCount,
        finalCount,
      });

      return res.json({
        success: finalCount === 0,
        message: finalCount === 0 
          ? `Successfully deleted ${deletedCount + secondDeletedCount} orders (required 2 attempts)`
          : `Deleted ${deletedCount + secondDeletedCount} orders, but ${finalCount} orders still remain`,
        deletedCount: deletedCount + secondDeletedCount,
        beforeCount,
        afterCount: finalCount,
        warning: finalCount > 0 ? `${finalCount} orders could not be deleted` : undefined,
      });
    }

    res.json({
      success: true,
      message: `Successfully deleted ${deletedCount} orders`,
      deletedCount,
      beforeCount,
      afterCount: 0,
    });
  } catch (error) {
    console.error("[clearAllOrders] Error:", error);
    console.error("[clearAllOrders] Error stack:", error.stack);
    res.status(500).json({ success: false, error: error.message });
  }
}
