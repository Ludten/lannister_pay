const express = require("express");
const Pay = require("../../util/util");

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const amount = req.body.Amount;
    const info = req.body.SplitInfo;
    const id = req.body.ID

    if (!amount) {
      return res.status(400).send({message: 'Amount is required or malformed.'});
    }

    if (!info) {
      return res.status(400).send({message: 'split information is required or malformed.'});
    }

    if (!id) {
      return res.status(400).send({message: 'id is required or malformed.'});
    }

    let SplitBreakdown = [];
    let ratio = 0;
    let camount = amount;

    if (info.length < 1 || info.length > 20)
    {
      throw "API can only support a a minimum of 1 split entity and a maximum of 20 entities"
    }

    //compute FLAT
    for (let i = 0; i < info.length; i++) {
      let obj1 = {};
      const element = info[i];
      if (Object.keys(element).length != 3)
      {
        throw "need valid split entry";
      }
      if (typeof (element['SplitType']) !== 'string')
      {
        throw "Not a string";
      }
      if (typeof (element['SplitValue']) !== 'number' || (element['SplitValue']) < 0)
      {
        throw "Not a valid number";
      }
      if ((element['SplitValue']) > camount)
      {
        throw "split amount too big";
      }
      if ((element['SplitType']) === 'FLAT')
      {
        obj1["SplitEntityId"] = element['SplitEntityId'];
        obj1["amount"] = element['SplitValue'];
        camount -= element['SplitValue'];
        SplitBreakdown.push(obj1);
      }
    }

    //check if sum is still on track
    if (camount < 0) {
      throw "Amounts do not add up."
    }

    //COMPUTE PERCENTAGES
    for (let i = 0; i < info.length; i++) {
      let obj2 = {};
      const element = info[i];
      if ((element['SplitType']) === 'PERCENTAGE')
      {
        obj2["SplitEntityId"] = element['SplitEntityId'];
        obj2["amount"] = (camount * 0.01 * element['SplitValue']);
        camount -= obj2["amount"];
        SplitBreakdown.push(obj2);
      }
      else if ((element['SplitType']) === 'RATIO')//CHECK FOR RATIOS
      {
        ratio += element['SplitValue'];
      }
    }

    //another check on the offchance more than 100% was actually passed
    if (camount < 0) {
      throw "Amounts do not add up."
    }

    //COMPUTE RATIO
    if (ratio > 0) {
      for (let i = 0; i < info.length; i++) {
        let obj3 = {};
        const element = info[i];
        if ((element['SplitType']) === 'RATIO')
        {
          obj3["SplitEntityId"] = element['SplitEntityId'];
          obj3["amount"] = (camount * (element['SplitValue'] / ratio));
          SplitBreakdown.push(obj3);
        }
      }
      camount = 0;
    }


    bal = new Pay();
    bal.ID = id;
    bal.Balance = camount;
    bal.SplitBreakdown = SplitBreakdown;
    res.status(200).json(bal);

  } catch (err) {
    return res.status(500)
              .send(err);
  };
});

module.exports = router;
