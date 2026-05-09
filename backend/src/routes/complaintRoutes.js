const express = require('express');
const { 
  createComplaint, 
  getMyComplaints, 
  getAllComplaints, 
  updateComplaintStatus,
  getComplaintById,
  deleteComplaint
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const { complaintRules, validate } = require('../middleware/validatorMiddleware');

const router = express.Router();

// Publicly accessible to logged in users (Student & Admin)
router.route('/')
  .get(protect, getMyComplaints)
  .post(protect, upload.array('attachments', 5), complaintRules(), validate, createComplaint);

// Admin only routes
router.get('/all', protect, authorize('admin'), getAllComplaints);
router.patch('/:id/status', protect, authorize('admin'), updateComplaintStatus);

// Routes for specific complaint
router.route('/:id')
  .get(protect, getComplaintById)
  .delete(protect, deleteComplaint);

module.exports = router;


