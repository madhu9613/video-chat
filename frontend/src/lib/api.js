import axiosInstance from "./axios";

const signup = async (signupData) => {

  const { data } = await axiosInstance.post("/auth/signup",
    signupData

  );
  return data

}

const signin = async (signinData) => {

  const { data } = await axiosInstance.post("/auth/login",
    signinData

  );
  return data

}

const fetchUserProfile = async () => {
  try {
    const { data } = await axiosInstance.get("/auth/me", {
      withCredentials: true,

    });

    return data.user;
  } catch (err) {
    console.error("Auth check failed:", err);
    throw err;
  }
};

const onboarding = async (formData) => {
  try {
    const { data } = await axiosInstance.post("/auth/onboarding", formData);

    if (data.success) {
      return data.user;
    } else {
      throw new Error("Onboarding failed. Server returned success: false.");
    }

  } catch (error) {
    console.error(" Error in onboarding:", error?.response?.data?.message || error.message);
    throw error;
  }
};

const logout = async () => {

  const { data } = await axiosInstance.post("/auth/logout",


  );
  return data

}

const getUserFriends = async () => {
  const { data } = await axiosInstance.get("/user/friends");
  if (data.success) {
    return data.friends;
  } else {
    const msg = data.message || "something went wrong"
    throw new Error(msg);
  }
};

const getRecommendedUsers = async () => {
  const { data } = await axiosInstance.get("/user");
  if (data.success) {
    return data.recommendedUsers;
  } else {
    const msg = data.message || "something went wrong"
    throw new Error(msg);
  }
};
const getOutgoingReq = async () => {
  const { data } = await axiosInstance.get("/user/outgoing-friend-requests");
  if (data.success) {
    return data.outgoinReq;
  } else {
    const msg = data.message || "something went wrong"
    throw new Error(msg);
  }
};

const sendFriendReq = async (userId) => {

  const { data } = await axiosInstance.post(`/user/friend-request/${userId}`);
  if (data.success) {
    return data;
  }
  else{
    const msg=data.message || "something went wrong";
    throw new Error(msg)
  }


}


const cancelFriendRequest=async(targetUserId)=>{
  const {data}=await axiosInstance.post(`/user/cancel-friend-request/${targetUserId}/cancel`)
  if(data.success)
  {
    return data
  }
   else{
    const msg=data.message || "something went wrong";
    throw new Error(msg)
  }

  
}

const getFriendsReq=async()=>{

  const {data}=await axiosInstance.get("/user/friend-requests");
  if(data.success)
  {
    const incomingreq=data.incomingReqs;
    const acceptedreq=data.acceptedReqs;
    return {incomingreq,acceptedreq}
  }
  else{
    throw new Error(data.message)
  }
}

const acceptFriendReq=async(targetUserId)=>{
  console.log(`/user/friend-request/${targetUserId}/accept`);

  const {data}=await axiosInstance.put(`/user/friend-request/${targetUserId}/accept`)
  if(data.success)
  {
    return data
  }
   else{
    const msg=data.message || "something went wrong";
    console.log(data.message);
  
    throw new Error(msg)
  }

  
}
export {
  signup,
  fetchUserProfile,
  signin,
  onboarding,
  logout,
  getUserFriends,
  getRecommendedUsers,
  getOutgoingReq,
  sendFriendReq,
  cancelFriendRequest,
  getFriendsReq,
  acceptFriendReq
}