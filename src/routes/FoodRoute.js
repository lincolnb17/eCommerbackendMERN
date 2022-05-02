const express = require("express");
const { getAllFoods,
    createFoods,
    updateFoods,
    deleteFoods,
    getFoodDetails,
    createFoodReview,
    getFoodReviews,
    deleteReviews,
} = require("../controllers/foodController");
const {isAuthenticatedUser,authorizedRoles}= require("../middleware/auth");
const router = express.Router();


router
.route("/food")
.get(getAllFoods);

router
.route("/admin/food/new")
.post(isAuthenticatedUser,authorizedRoles("admin"),createFoods);

router
.route("/admin/food/:id")
.put(isAuthenticatedUser,authorizedRoles("admin"),updateFoods)
.delete(isAuthenticatedUser,authorizedRoles("admin"),deleteFoods)

router
.route("/food/:id")
.get(getFoodDetails);

router.route("/review").put(isAuthenticatedUser,createFoodReview);

router
.route("/reviews")
.get(getFoodReviews)
.delete(isAuthenticatedUser,deleteReviews);





module.exports=router