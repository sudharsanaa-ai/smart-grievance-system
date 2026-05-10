const Complaint = require('../models/Complaint');
const { checkSimilarity } = require('../utils/priorityUtils');
const sendEmail = require('../utils/email');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res, next) => {
  try {
    const { subject, description, category, priority: userPriority } = req.body;

    // 1. Find recent active complaints in the same category to check for similarity
    const activeComplaints = await Complaint.find({
      category,
      status: { $in: ['Submitted', 'Pending'] },
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });

    let duplicateCount = 0;
    activeComplaints.forEach(existing => {
      if (checkSimilarity(subject, existing.subject)) {
        duplicateCount++;
      }
    });

    // 2. Determine smart priority
    let finalPriority = userPriority || 'medium';
    let isRepeated = false;

    if (duplicateCount >= 2) {
      finalPriority = 'high';
      isRepeated = true;
    }

    // Generate a random 4-digit ID
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const complaintId = `CMP-${randomDigits}`;

    // Handle File Attachments
    const attachments = req.files ? req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      name: file.originalname
    })) : [];

    const complaint = await Complaint.create({
      complaintId,
      user: req.user._id,
      subject,
      description,
      category,
      priority: finalPriority,
      status: 'Submitted',
      duplicateCount,
      isRepeated,
      attachments
    });

    // Notify admins via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('newComplaint', complaint);
    }

    res.status(201).json({
      status: 'success',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user complaints
// @route   GET /api/complaints
// @access  Private
const getMyComplaints = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Complaint.countDocuments({ user: req.user._id });
    const complaints = await Complaint.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v')
      .lean();

    res.status(200).json({
      status: 'success',
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints (Admin only)
// @route   GET /api/complaints/all
// @access  Private/Admin
const getAllComplaints = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Complaint.countDocuments({});
    const complaints = await Complaint.find({})
      .populate('user', 'userId email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v')
      .lean();

    res.status(200).json({
      status: 'success',
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status (Admin only)
// @route   PATCH /api/complaints/:id/status
// @access  Private/Admin
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Submitted', 'Pending', 'Resolved', 'Rejected'];

    if (!validStatuses.includes(status)) {
      const err = new Error('Invalid status value');
      err.statusCode = 400;
      return next(err);
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'userId email');

    if (!complaint) {
      const err = new Error('Complaint not found');
      err.statusCode = 404;
      return next(err);
    }

    // Real-time notification via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(complaint.user.userId).emit('statusUpdated', {
        complaintId: complaint.complaintId,
        subject: complaint.subject,
        newStatus: status
      });
      io.emit('complaintUpdated', complaint);
    }

    // Email notification on resolution
    if (status === 'Resolved' && complaint.user.email) {
      try {
        await sendEmail({
          email: complaint.user.email,
          subject: `Complaint Resolved: ${complaint.complaintId}`,
          message: `Your complaint "${complaint.subject}" (ID: ${complaint.complaintId}) has been marked as Resolved.`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #10b981;">Grievance Resolved!</h2>
              <p>Hello,</p>
              <p>We are pleased to inform you that your grievance has been resolved by the administrator.</p>
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${complaint.subject}</p>
                <p style="margin: 0;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Resolved</span></p>
              </div>
              <p>Thank you for using the Smart Grievance Management System.</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Email failed to send:', emailError);
      }
    }



    res.status(200).json({
      status: 'success',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('user', 'userId email');

    if (!complaint) {
      const err = new Error('Complaint not found');
      err.statusCode = 404;
      return next(err);
    }

    // Check if user is admin or if the complaint belongs to the student
    if (req.user.role !== 'admin' && complaint.user._id.toString() !== req.user._id.toString()) {
      const err = new Error('Not authorized to view this complaint');
      err.statusCode = 403;
      return next(err);
    }

    res.status(200).json({
      status: 'success',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      const err = new Error('Complaint not found');
      err.statusCode = 404;
      return next(err);
    }

    // Check if user is admin or if the complaint belongs to the student
    if (req.user.role !== 'admin' && complaint.user.toString() !== req.user._id.toString()) {
      const err = new Error('Not authorized to delete this complaint');
      err.statusCode = 403;
      return next(err);
    }

    await complaint.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Complaint removed'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  getComplaintById,
  deleteComplaint
};

