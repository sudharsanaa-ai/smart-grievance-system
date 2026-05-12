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

const router = express.Router();

// Student & Admin: get/create complaints
router.route('/')
  .get(protect, getMyComplaints)
  .post(protect, upload.array('attachments', 5), createComplaint);

// Admin only routes
router.get('/all', protect, authorize('admin'), getAllComplaints);
router.patch('/:id/status', protect, authorize('admin'), updateComplaintStatus);

// Specific complaint routes
router.route('/:id')
  .get(protect, getComplaintById)
  .delete(protect, deleteComplaint);

module.exports = router;
