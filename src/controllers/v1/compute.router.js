const express = require("express");
const Pay = require("../../util/util");
const arr = require("array-of-objects-functions");

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
    let camount = amount;

    if (info.length < 1 || info.length > 20)
    {
      throw "API can only support a minimum of 1 split entity and a maximum of 20 entities"
    }

    const rayt = arr.findAllMatching(info, "SplitType", 'RATIO');
    const ratio = rayt.reduce((accumlator, object) => {
      return accumlator + object.SplitValue;
    }, 0);

    info.sort((a, b) => (a.SplitType > b.SplitType) - (a.SplitType < b.SplitType));


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

        //check if sum is still on track
        if (camount < 0) {
          throw "Amounts do not add up."
        }
      }
      else if ((element['SplitType']) === 'PERCENTAGE')
      {
        obj1["SplitEntityId"] = element['SplitEntityId'];
        obj1["amount"] = (camount * 0.01 * element['SplitValue']);
        camount -= obj1["amount"];
        SplitBreakdown.push(obj1);

        //check if sum is still on track
        if (camount < 0) {
          throw "Amounts do not add up."
        }
      }
      else if (ratio > 0 && ((element['SplitType']) === 'RATIO')) {
        obj1["SplitEntityId"] = element['SplitEntityId'];
        obj1["amount"] = (camount * (element['SplitValue'] / ratio));
        SplitBreakdown.push(obj1);
      }
    }

    if (ratio > 0) {
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
