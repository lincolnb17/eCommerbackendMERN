const Food = require("../models/FoodModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const Apifeatures = require("../utils/apiFeatures");

//create Foods or add foods
exports.createFoods = catchAsyncError(async(req,res,next)=>{
    req.body.user =  req.user.id;
    const food = await Food.create(req.body);
    res.status(201).json({
        sucess:true,
        food
    })
});

//get all foods
exports.getAllFoods = catchAsyncError(async (req,res)=>{
    const resultPerPage = 5;
    const foodCount = await Food.countDocuments();

    const apiFeature=  new Apifeatures(Food.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    const foods = await apiFeature.query;
    res.status(200).json({
        sucess:true,
        foods
    });
});

//get single food details
exports.getFoodDetails = catchAsyncError( async(req,res,next)=>{
    const food = await Food.findById(req.params.id);
    if(!food){
        return next(new ErrorHandler("Food not found",404));

    }
    res.status(200).json({
        sucess:true,
        food,
        
    })
});


//update food---admin
exports.updateFoods = catchAsyncError( async(req,res,next)=>{
    let food = await Food.findById(req.params.id);
    if(!food){
        return next(new ErrorHandler("Food not found",404));

    }
    food = await Food.findByIdAndUpdate(req.params.id,req.body,{
        new:true
    });
    res.status(200).json({
        sucess:true,
        food
    });
});

//Delete foods items
exports.deleteFoods= catchAsyncError (async (req,res,next)=>{
    const food = await Food.findById(req.params.id);
    if(!food){
        return next(new ErrorHandler("Food not found",404));
        }
        
        await food.remove();
        res.status(200).json({
            sucess:false,
            message:"food item delete sucessfully"
        })
});


//CREATE NEW REVIEW OR UPDATE REVIEW

exports.createFoodReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, foodId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const food = await Food.findById(foodId);
  
    const isReviewed = food.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      food.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
        food.reviews.push(review);
        food.numOfReviews = food.reviews.length;
    }
  
    let avg = 0;
  
    food.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
   food.ratings = avg / food.reviews.length;
  
    await food.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });

  //get all reviews of a food
  exports.getFoodReviews = catchAsyncError(async(req,res,next)=>{
      const food = await Food.findById(req.query.id);
      if(!food){
          return next(new ErrorHandler("Food not found",404));  
      }
      res.status(200).json({
          sucess:true,
          reviews:food.reviews,
      });
  });

  ///delete a reviews

  exports.deleteReviews = catchAsyncError(async(req,res,next)=>{
      const food = await Food.findById(req.query.foodId);

      if(!food){
          return next(new ErrorHandler("Food not found",404));
      }
      const reviews = food.reviews.filter(
          (rev)=>rev._id.toString() !== req.query.id.toString());

      let avg = 0;

  
      reviews.forEach((rev) => {
        avg += rev.rating;
      });
    
     const ratings = avg /reviews.length;

     const numOfReviews= reviews.length;

     await Food.findByIdAndUpdate(
         req.query.foodId,{
             reviews,
             ratings,
             numOfReviews,

         },
         {
             new:true,
             runValidators:true,
             useFindAndModify:false,
         }
     );


     res.status(200).json({
         success:true
     });
  })



