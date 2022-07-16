const express = require("express");
const ComputeRouter = require("./compute.router");

const router = express.Router();

router.use('/split-payments/compute', ComputeRouter);


module.exports = router;