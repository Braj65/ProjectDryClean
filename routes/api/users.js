const express = require("express");
const router = express.Router();

//Load input validation
const validateReceiveInput = require("../../validation/receive");
const validateDeliverInput = require("../../validation/deliver");
//Load user and cloth model
const User = require("../../models/user");
const Cloth = require("../../models/clothes");
const Orderid = require("../../models/orderid");

//@route POST api/users/orderreceive
//@desc Receive order from user
//@access public route
router.post("/orderreceive", (req, res) => {
  const { errors, isValid } = validateReceiveInput(req.body);
  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // var newClothName = req.body.clothname;
  // var newClothDescription = req.body.description;
  var order = req.body.order;
  var user = req.body.user;

  User.findOne({ mobilenumber: req.body.user.mobilenumber }, function(
    err,
    foundUser
  ) {
    if (err || foundUser === null) {
      console.log("I AM HERE");
      User.create(user, function(err, newUser) {
        if (err) res.status(404).json(err);
        else {
          Orderid.create({}, function(err, newOrderid) {
            let allclothes = [];
            if (err) res.status(404).json(err);
            else {
              order.map(cloth => {
                Cloth.create(
                  {
                    name: cloth.clothname,
                    description: cloth.description,
                    orderid: newOrderid
                  },
                  function(err, newCloth) {
                    if (err) res.status(404).json(err);
                    else {
                      Orderid.update(
                        { _id: newOrderid._id },
                        { $push: { clothes: newCloth } },
                        function(err, succ) {
                          if (err) console.log(err);
                          else console.log(succ);
                        }
                      );
                    }
                  }
                );
              });
            }
            newUser.orderids.push(newOrderid);
            newUser.save();
            res.json(newOrderid);
          });
        }
      });
    } else {
      console.log("I AM THERE");
      Orderid.create({}, function(err, newOrderid) {
        if (err) res.status(404).json(err);
        else {
          order.map(cloth => {
            Cloth.create(
              {
                name: cloth.clothname,
                description: cloth.description,
                orderid: newOrderid
              },
              function(err, newCloth) {
                if (err) res.status(404).json(err);
                else {
                  Orderid.update(
                    { _id: newOrderid._id },
                    { $push: { clothes: newCloth } },
                    function(err, succ) {
                      if (err) console.log(err);
                      else console.log(succ);
                    }
                  );
                }
              }
            );
          });
        }
        foundUser.orderids.push(newOrderid);
        foundUser.save();
        res.json(newOrderid);
      });
    }
  });

  /* User.findOne({ mobilenumber: req.body.user.mobilenumber }, function(
    err,
    foundUser
  ) {
    if (err || foundUser === null) {
      User.create(user, function(err, newUser) {
        if (err) res.status(404).json(err);
        else {
          Cloth.create(
            {
              name: newClothName,
              description: newClothDescription
            },
            function(err, newCloth) {
              if (err) res.status(404).json(err);
              else {
                newUser.clothes.push(newCloth);
                newUser.save();
                res.json(newUser);
                // res.redirect("/initial");
              }
            }
          );
        }
      });
    } else {
      Cloth.create(
        {
          name: newClothName,
          description: newClothDescription
        },
        function(err, newCloth) {
          if (err) res.status(404).json(err);
          else {
            foundUser.clothes.push(newCloth);
            foundUser.save();
            res.json(foundUser);
            //res.redirect("/initial");
          }
        }
      );
    }
  }); */
});

//@route GET api/users/orderdeliver
//@desc Deliver order to user
//@access public route
router.post("/orderdeliver", function(req, res) {
  const { errors, isValid } = validateDeliverInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const errs = {};
  var cellNumber = req.body.mobilenumber;
  User.findOne({ mobilenumber: req.body.user.mobilenumber })
    .populate("clothes")
    .exec(function(err, foundUser) {
      if (err) {
        errs.mobilenumber = err;
        return res.status(404).json(errs);
      } else if (foundUser === null) {
        errs.mobilenumber = "There are no orders placed by this user";
        return res.status(404).json(errs);
      } else {
        res.json(foundUser);
        // res.render("orderhistory", { user: foundUser });
      }
    });
});
module.exports = router;