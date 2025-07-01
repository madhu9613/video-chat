import FriendRequest from "../models/FriendRequest.model.js";
import User from "../models/User.model.js";

// ✅ Get recommended users (not current user or already friends)
const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      _id: { $ne: currentUserId, $nin: currentUser.friends },
      isOnboarded: true,
    });

    res.status(200).json({
      success: true,
      recommendedUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get current user's friends
const getMyFriends = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const user = await User.findById(currentUserId)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json({
      success: true,
      friends: user.friends,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Send friend request
const sendFriendReq = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { id: recipientId } = req.params;

    if (currentUserId === recipientId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a request to yourself",
      });
    }

    const recipient = await User.findOne({
      _id: recipientId,
      isOnboarded: true,
    });

    if (!recipient) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (recipient.friends.includes(currentUserId)) {
      return res.status(400).json({
        success: false,
        message: "You are already friends with this user",
      });
    }

    const existingReq = await FriendRequest.findOne({
      $or: [
        { sender: currentUserId, recipient: recipientId },
        { sender: recipientId, recipient: currentUserId },
      ],
    });

    if (existingReq) {
      return res.status(400).json({
        success: false,
        message: "A friend request already exists between you and the user",
      });
    }

    await FriendRequest.create({
      sender: currentUserId,
      recipient: recipientId,
    });

    res.status(201).json({
      success: true,
      message: "Friend request sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Accept a friend request
const acceptFriendReq = async (req, res) => {
  try {
    const { id: requestId } = req.params;

    const friendReq = await FriendRequest.findById(requestId);

    if (!friendReq) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    if (friendReq.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this request",
      });
    }

    friendReq.status = "accepted";
    await friendReq.save();

    await User.findByIdAndUpdate(friendReq.sender, {
      $addToSet: { friends: friendReq.recipient },
    });

    await User.findByIdAndUpdate(friendReq.recipient, {
      $addToSet: { friends: friendReq.sender },
    });

    res.status(201).json({
      success: true,
      message: "Friend request accepted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get incoming and accepted friend requests
const getFriendReq = async (req, res) => {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json({
      success: true,
      incomingReqs,
      acceptedReqs,
    });
  } catch (error) {
    console.error(error);
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get all outgoing pending friend requests
const getOutgoingFriendReqs = async (req, res) => {
  try {
    const outgoinReq = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json({
      success: true,
      outgoinReq,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Cancel friend request (CORRECTED for FriendRequest model)
const cancelFriendRequest = async (req, res) => {
  try {
  const targetUserId = req.params.id;

    const currentUserId = req.user.id;

    console.log("🔁 Attempting to cancel request from", currentUserId, "to", targetUserId);

    const deleted = await FriendRequest.findOneAndDelete({
      sender: currentUserId,
      recipient: targetUserId,
      status: "pending",
    });

    if (!deleted) {
      console.log("⚠️ No request found to cancel.");
      return res.status(404).json({
        success: false,
        message: "No pending friend request found to cancel.",
      });
    }

    console.log("✅ Friend request cancelled:", deleted._id);

    res.status(200).json({
      success: true,
      message: "Friend request cancelled successfully.",
    });
  } catch (error) {
    console.error("❌ Error cancelling friend request:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not cancel request.",
    });
  }
};

// ✅ Export all
export {
  getRecommendedUsers,
  getMyFriends,
  sendFriendReq,
  acceptFriendReq,
  getFriendReq,
  getOutgoingFriendReqs,
  cancelFriendRequest,
};
