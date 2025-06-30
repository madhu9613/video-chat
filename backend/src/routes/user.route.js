import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { acceptFriendReq, cancelFriendRequest, getFriendReq, getMyFriends, getOutgoingFriendReqs, getRecommendedUsers ,sendFriendReq} from "../controllers/user.controller.js"

const userRouter=express.Router()

userRouter.use(protectRoute)

userRouter.get("/",getRecommendedUsers)
userRouter.get("/friends",getMyFriends)

userRouter.post("/friend-request/:id",sendFriendReq)
userRouter.put("/friend-request/:id/accept",acceptFriendReq)
userRouter.get("/friend-requests",getFriendReq)
userRouter.get("/outgoing-friend-requests",getOutgoingFriendReqs)
userRouter.post("/cancel-friend-request/:id/cancel",cancelFriendRequest)




export default userRouter 