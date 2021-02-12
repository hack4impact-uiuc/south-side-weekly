const express = require('express');
const router = express.Router();
const { errorWrap } = require('../middleware');

const User = require('../models/user');

router.get(
  '/',
  errorWrap(async (req, res) => {
    const user = await User.findOne();
    res.status(200).json({
      message: `Successfully retrieved ${user.name} users.`,
      success: true,
      result: user,
    });
  }),
);

module.exports = router;
