import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserFriends } from '../lib/api';
import { toast } from 'react-hot-toast';
import { Search, Users, MapPin, MessageCircle } from 'lucide-react';
import { getLanguageFlag } from '../components/FriendCard';
import { Link } from 'react-router';

const FriendsPage = () => {
  const [search, setSearch] = useState('');

  const {
    data: friends = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
    onError: () => toast.error('Failed to load friends'),
  });

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const filteredFriends = friends.filter((friend) => {
    const term = search.toLowerCase();
    return (
      friend.fullName.toLowerCase().includes(term) ||
      friend.nativeLanguage.toLowerCase().includes(term) ||
      friend.learningLanguage.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Your Friends
          </h1>
          <p className="text-sm opacity-70 mt-1">
            View and message your language exchange partners.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or language..."
            className="input input-bordered w-full pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : isError ? (
        <div className="text-center text-error font-medium">Failed to load friends.</div>
      ) : filteredFriends.length === 0 ? (
        <div className="text-center py-10 opacity-70">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3989/3989830.png"
            alt="No friends"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold">No friends found</h3>
          <p className="text-sm">Try searching by name or language.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFriends.map((friend) => (
            <div
              key={friend._id}
              className="card bg-base-200 border border-base-300 p-5 shadow hover:border-primary transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={friend.profilePic}
                    alt={friend.fullName}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{friend.fullName}</h3>
                    {friend.location && (
                      <p className="flex items-center text-xs mt-1 text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {friend.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge badge-secondary">
                    {getLanguageFlag(friend.nativeLanguage)} Native: {capitalize(friend.nativeLanguage)}
                  </span>
                  <span className="badge badge-outline">
                    {getLanguageFlag(friend.learningLanguage)} Learning: {capitalize(friend.learningLanguage)}
                  </span>
                </div>
              </div>

              {/* Message Button */}
              <Link
                to={`/chat/${friend._id}`} // Update this if your chat route is different
                className="btn btn-sm btn-accent w-full mt-2"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
