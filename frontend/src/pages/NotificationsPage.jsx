import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { acceptFriendReq, getFriendsReq } from '../lib/api';
import { toast } from 'react-hot-toast';
import {
  Check,
  Loader2,
  Users,
  Handshake,
  SmilePlus,
  MailWarning,
} from 'lucide-react';

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['friendReq'],
    queryFn: getFriendsReq,
  });

  const {
    mutate: acceptReqMutation,
    isPending: accepting,
  } = useMutation({
    mutationFn: acceptFriendReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendReq'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast.success('Friend request accepted');
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to accept request');
    },
  });

  const incomingReqs = data?.incomingreq || [];
  const acceptedreqs = data?.acceptedreq || [];

  console.log(incomingReqs);
  
  console.log(acceptedreqs);
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10" data-theme="dark">
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          Friend Requests
        </h1>
        <p className="text-sm opacity-70 mt-2">
          Manage incoming and accepted friend requests
        </p>
      </div>

      {/* Incoming Friend Requests */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <MailWarning className="w-5 h-5 text-warning" />
          Incoming Requests
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-error text-center">Failed to load requests</div>
        ) : incomingReqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-base-200 p-6 rounded-lg shadow text-center">
            <SmilePlus className="w-10 h-10 text-accent mb-2" />
            <p className="text-sm opacity-70">No incoming friend requests at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incomingReqs.map((req) => (
              <div
                key={req._id}
                className="flex items-center justify-between p-4 bg-base-100 border border-base-300 rounded-lg shadow hover:border-primary/50 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={req.sender.profilePic}
                    alt={req.sender.fullName}
                    className="w-12 h-12 rounded-full object-cover ring ring-primary ring-offset-1"
                  />
                  <div>
                    <p className="font-semibold">{req.sender.fullName}</p>
                    <p className="text-sm opacity-70">
                      {req.sender.nativeLanguage} → {req.sender.learningLanguage}
                    </p>
                  </div>
                </div>

                <button
                  className="btn btn-success btn-sm"
                  onClick={() => acceptReqMutation(req._id)}
                  disabled={accepting}
                >
                  {accepting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Accepted Friend Requests */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Handshake className="w-5 h-5 text-green-500" />
          Accepted Friends
        </h2>

        {acceptedreqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-base-200 p-6 rounded-lg shadow text-center">
            <SmilePlus className="w-10 h-10 text-accent mb-2" />
            <p className="text-sm opacity-70">No accepted requests yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {acceptedreqs.map((req) => {
  const friend = req.recipient; 

  return (
    <div
      key={req._id}
      className="card bg-base-100 border border-base-300 p-4 shadow hover:border-primary/40 transition"
    >
      <div className="flex items-center gap-4">
        <img
          src={friend.profilePic}
          alt={friend.fullName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold">{friend.fullName}</h3>
          <p className="text-sm opacity-70">
            {friend.nativeLanguage} → {friend.learningLanguage}
          </p>
        </div>
      </div>
    </div>
  );
})}

          </div>
        )}
      </section>
    </div>
  );
};

export default NotificationsPage;
