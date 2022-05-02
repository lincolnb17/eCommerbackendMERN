const Order = require("../models/orderModel");
const Food = require("../models/FoodModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

//create a new order

exports.newOrder = catchAsyncError(async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });
    res.status(201).json({
        success:true,
        order,
    });
});

//get single order

exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order =  await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );
    if(!order){
        return next(new ErrorHandler("Order is not found with this id"),404);
    }
    res.status(200).json({
        success:true,
        order,
    });
});

//get looged in user  order

exports.myOrders = catchAsyncError(async(req,res,next)=>{
    const orders =  await Order.find({
        user:req.user._id
    });
    
    res.status(200).json({
        success:true,
        orders,
    });
});


//get all orders
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
    const orders =  await Order.find();
    if(orders==0){
        return next(new ErrorHandler("Order not found ",404));
    }
    let totalAmount=0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
        
    });
    
    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    });
});

//update order status admin
exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order =  await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found",404));
    }
    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("Order Delivered",400));
    }
    order.orderItems.forEach(async o=>{
        await updateStock(o.Food,o.quantity);
    });
    order.orderStatus = req.body.status;
    if(req.body.status=="Delivered"){
        order.deliveredAt = Date.now();

    }
    await order.save({validateBeforeSave:false});

    
    res.status(200).json({
        success:true,
    });
});
async function updateStock(id,quantity){
    const food = await Food.findById(id);
    food.stock -=quantity;
    await food.save({validateBeforeSave:false});
}


//delete order-admin
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order =  await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found with this id",404));
    }
    await order.remove();

 
    
    res.status(200).json({
        success:true,
        order,
    });
});

