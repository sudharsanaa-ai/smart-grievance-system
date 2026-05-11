const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().forEach(err => {
    extractedErrors.push({ [err.path || err.param]: err.msg });
  });

  return res.status(422).json({
    success: false,
    error: extractedErrors[0] ? Object.values(extractedErrors[0])[0] : 'Validation Error',
    errors: extractedErrors,
  });
};

const loginRules = () => {
  return [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
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
