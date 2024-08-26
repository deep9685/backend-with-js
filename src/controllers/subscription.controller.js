import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    // TODO: toggle subscription
    
    const isSubscribed = await Subscription.aggregate([
        {
            $match: {
                subscriber: req.user._id,
                channel: channelId
            }
        }
    ]);

    if(isSubscribed.length > 0){
        await Subscription.findByIdAndDelete( isSubscribed._id);
        return res.status(200).json(
            new ApiResponse(
                200,
                {isSubscribed:false},
                "Unsubscribed"
            )
        )
    }
    else{
        const subscribed = await Subscription.create({
            subscriber:req.user._id,
            channel:channelId
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {isSubscribed:true},
                "Subscribed"
            )
        );
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const subscriberList = await Subscription.aggregate([
        {
            $match:{
                channel:channelId
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscribers"    
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                subscriberList,
                suubscriber: subscriberList.length
            },
            "Subscriber list is fetched successfully"
        )
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    const channelList = await Subscription.aggregate([
        {
            $match:{
                subscriber:subscriberId
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"Channels"    
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                channelList,
                Channels: channelList.length
            },
            "Channels list is fetched successfully"
        )
    )

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}