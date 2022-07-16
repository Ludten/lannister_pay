const express = require("express");
const ComputeRouter = require("./compute.router");

const router = express.Router();

router.use('/split-payments/compute', ComputeRouter)
      .get('/', async (req, res) => {
	res.send(`V1`);
      });


module.exports = router;