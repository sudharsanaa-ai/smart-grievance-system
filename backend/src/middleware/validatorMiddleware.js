const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    success: false,
    errors: extractedErrors,
  });
};

const loginRules = () => {
  return [
    body('userId').notEmpty().withMessage('User ID is required'),
  ];
};

const complaintRules = () => {
  return [
    body('subject').notEmpty().trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
    body('description').notEmpty().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('category').isIn(['hostel', 'academic', 'infrastructure', 'other']).withMessage('Invalid category'),
  ];
};

module.exports = {
  validate,
  loginRules,
  complaintRules,
};
