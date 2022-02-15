const express = require("express");
const router = express.Router();
const { UserController } = require("../controllers");
const { Validations } = require("../middlewares");
const { UserValidations } = require("../validations");

router.get("/", UserController.index);
router.post(
  "/",
  UserValidations.SignupValidations,
  Validations.handleValidationErrors,
  UserController.store
);
router.put("/:id", UserController.update);
router.delete("/", UserController.destroy);
router.get("/:id", UserController.details);

module.exports = router;
