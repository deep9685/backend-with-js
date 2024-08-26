import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;

    if(!content){
        throw new ApiError(404, "Content is missing");
    }

    const owner = req.user._id;

    const newTweet = await Tweet.create({
        content,
        owner
    });

    if(!newTweet){
        throw new ApiError(500, "Something went wrong while creating the tweet!");
    }

    return res.status(201).json(
        new ApiResponse(
            200,
            newTweet,
            "Tweet created Successfully"
        )
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.params.userId;

    if(!userId){
        throw new ApiError(404, {}, "userId is missing");
    }

    const tweets = await Tweet.aggregate([
        {$match: {owner: userId}},
        // {$project:{
        //     "content":1
        // }}
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            tweets,
            "All tweets fetched successfully"
        )
    );
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const newContent = req.body;

    if(!newContent){
        throw new ApiError(404, {}, "Content is missing")
    }


    const tweetId = req.params.tweetId;

    if(!tweetId){
        throw new ApiError(404, {}, "Tweet id is missing");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content : newContent
            }
        },
        {new: true}
    )

    if(!updatedTweet){
        throw new ApiError(500, {}, "Unable to update tweet");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedTweet,
            "Tweet is updated Successfully"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const tweetId = req.params.tweetId;

    if(!tweetId){
        throw new ApiError(404, {}, "Tweet id is missing");
    }

    const deleteTweet = await Tweet.findByIdAndDelete(tweetId);

    if(!deleteTweet){
        throw new ApiError(404, {}, "No tweet found with this given ID");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Tweet deleted Successfully"
        )
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
