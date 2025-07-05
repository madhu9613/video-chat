import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
  getOutgoingReq,
  getRecommendedUsers,
  getUserFriends,
  sendFriendReq,
  cancelFriendRequest,
} from '../lib/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import { UsersIcon, UserPlus, UserX, MapPin } from 'lucide-react';
import NoFriendsFound from './NofriendFound';
import FriendCard, { getLanguageFlag } from '../components/FriendCard';

const HomePage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [outgoingReqIds, setOutgoingReqIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
    onError: () => toast.error('Failed to load friends'),
  });

  const { data: recommendedUsers = [], isLoading: loadingRecommended } = useQuery({
    queryKey: ['rec-users'],
    queryFn: getRecommendedUsers,
    onError: () => toast.error('Failed to load recommended users'),
  });

  const {
    data: outgoingFriendReq = [],
   
  } = useQuery({
    queryKey: ['outgoing_req'],
    queryFn: getOutgoingReq,
    onError: () => toast.error('Failed to load outgoing requests'),
  });

  const { mutate: sendReq, isPending: sending } = useMutation({
    mutationFn: sendFriendReq,
    onSuccess: () => {
      toast.success('Friend request sent');
      queryClient.invalidateQueries({ queryKey: ['outgoing_req'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to send request');
    },
  });

  const { mutate: cancelReq, isPending: cancelling } = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      toast.success('Friend request cancelled');
      queryClient.invalidateQueries({ queryKey: ['outgoing_req'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to cancel request');
    },
  });

  useEffect(() => {
    if (outgoingFriendReq?.length > 0) {
      const ids = new Set(outgoingFriendReq.map((req) => req.recipient._id));
      setOutgoingReqIds(ids);
    }
  }, [outgoingFriendReq]);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const [filterCountry, setFilterCountry] = useState('');
const [filterNativeLang, setFilterNativeLang] = useState('');
const [filterLearningLang, setFilterLearningLang] = useState('');



const filteredUsers = recommendedUsers.filter((user) => {
  const matchesName = user.fullName.toLowerCase().includes(search.toLowerCase());
  const matchesCountry = filterCountry ? user.location?.toLowerCase().includes(filterCountry.toLowerCase()) : true;
  const matchesNativeLang = filterNativeLang ? user.nativeLanguage?.toLowerCase() === filterNativeLang.toLowerCase() : true;
  const matchesLearningLang = filterLearningLang ? user.learningLanguage?.toLowerCase() === filterLearningLang.toLowerCase() : true;
  return matchesName && matchesCountry && matchesNativeLang && matchesLearningLang;
});


  return (
    <div className="p-4 sm:p-6 lg:p-8" data-theme="dark">
      <div className="container mx-auto space-y-10">
        {/* Friends Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notification" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {/* Friends List */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* Recommended Section */}
        <section>
          <div className="mb-6 sm:mb-8" >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-end sm:justify-end sm:gap-4">
  <input
    type="text"
    placeholder="Search by name..."
    className="input input-bordered input-sm w-full sm:w-60"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  <input
    type="text"
    placeholder="Country"
    className="input input-bordered input-sm w-full sm:w-40"
    value={filterCountry}
    onChange={(e) => setFilterCountry(e.target.value)}
  />
  <input
    type="text"
    placeholder="Native Language"
    className="input input-bordered input-sm w-full sm:w-40"
    value={filterNativeLang}
    onChange={(e) => setFilterNativeLang(e.target.value)}
  />
  <input
    type="text"
    placeholder="Learning Language"
    className="input input-bordered input-sm w-full sm:w-40"
    value={filterLearningLang}
    onChange={(e) => setFilterLearningLang(e.target.value)}
  />
</div>

            </div>
          </div>

          {loadingRecommended ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No matching users found</h3>
              <p className="text-base-content opacity-70">
                Try a different name or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => {
                const hasRequestBeenSent = outgoingReqIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      {/* Avatar and Info */}
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPin className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitalize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitalize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                      {/* Action Button */}
                      {hasRequestBeenSent ? (
                        <button
                          className="btn btn-warning btn-sm w-full"
                          onClick={() => cancelReq(user._id)}
                          disabled={cancelling}
                        >
                          <UserX className="size-4 mr-2" />
                          Cancel Request
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm w-full"
                          onClick={() => sendReq(user._id)}
                          disabled={sending}
                        >
                          <UserPlus className="size-4 mr-2" />
                          Send Friend Request
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
