const { createOrder, getOrders } = require('../utils/supabase');
const nodemailer = require('nodemailer');

// Create a new order
const createNewOrder = async (req, res) => {
  try {
    const { customerName, email, phone, cookieType, quantity, deliveryDate, customMessage, status } = req.body;
    
    // Map frontend fields to backend expectations
    const orderData = {
      name: customerName,
      email,
      phone,
      date: deliveryDate || new Date().toISOString(),
      type: cookieType,
      note: customMessage || '',
      quantity: quantity || 1
    };
    
    const order = await createOrder(orderData);
    
    // After order is saved, send notification email
    try {
      const notifyEmails = process.env.NOTIFY_EMAILS ? process.env.NOTIFY_EMAILS.split(',') : [];
      if (notifyEmails.length > 0) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });
        await transporter.sendMail({
          from: `ForeverCookie <${process.env.GMAIL_USER}>`,
          to: notifyEmails,
          subject: 'New Cookie Order Received',
          text: `New order details:\nName: ${order.customer_name}\nEmail: ${order.email}\nPhone: ${order.phone}\nCookie Type: ${order.cookie_type}\nQuantity: ${order.quantity}\nDelivery Date: ${order.order_date}\nMessage: ${order.notes || ''}`,
        });
      }
      // Placeholder for SMS notification (Twilio or similar)
      // TODO: Add SMS notification logic here in the future
    } catch (notifyErr) {
      console.error('Failed to send order notification:', notifyErr);
    }
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        id: order.id,
        customer_name: order.customer_name,
        email: order.email,
        phone: order.phone,
        order_date: order.order_date,
        cookie_type: order.cookie_type,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order'
    });
  }
};

// Get all orders (admin endpoint)
const getAllOrders = async (req, res) => {
  try {
    const orders = await getOrders();
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // This would need to be implemented in supabase.js
    // For now, we'll return a placeholder
    res.json({
      success: true,
      data: {
        id,
        message: 'Order details endpoint - implement in supabase.js'
      }
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // This would need to be implemented in supabase.js
    // For now, we'll return a placeholder
    res.json({
      success: true,
      data: {
        id,
        status,
        message: 'Order status update endpoint - implement in supabase.js'
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status'
    });
  }
};

module.exports = {
  createNewOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
}; 