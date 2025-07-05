import React, { useState } from 'react';
import useAuthUser from '../hooks/useAuthUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { onboarding } from '../lib/api';
import { toast } from 'react-hot-toast';
import { Edit, Save, Users, BadgeCheck, CheckCircle } from 'lucide-react';
import { LANGUAGES } from '../constant';

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || '',
    bio: authUser?.bio || '',
    nativeLanguage: authUser?.nativeLanguage || '',
    learningLanguage: authUser?.learningLanguage || '',
    location: authUser?.location || '',
    profilePic: authUser?.profilePic || '',
    bannerImage: authUser?.bannerImage || '',
  });

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: onboarding,
    onSuccess: () => {
      toast.success('Profile updated');
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      setIsEditing(false);
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const initials = formData.fullName
    .split(' ')
    .map((s) => s[0])
    .join('');

  const profileCompletion = Math.round(
    (Object.values(formData).filter(Boolean).length / 6) * 100
  );

  const completionEmoji =
    profileCompletion >= 80 ? '🔥' : profileCompletion >= 50 ? '🌟' : '🪞';

  return (
    <div className="w-full max-w-5xl mx-auto p-6" data-theme="dark">
      {/* Banner */}
      <div className="relative">
        <div className="h-40 bg-base-300 rounded-xl overflow-hidden">
          {formData.bannerImage ? (
            <img
              src={formData.bannerImage}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-base-content opacity-20">
              No Banner
            </div>
          )}
        </div>

        {/* Profile Picture */}
        <div className="absolute -bottom-10 left-6">
          <div className="avatar">
            <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {formData.profilePic ? (
                <img src={formData.profilePic} alt="Profile" />
              ) : (
                <div className="bg-neutral text-white w-full h-full flex items-center justify-center text-3xl">
                  {initials}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? (
              <input
                type="text"
                className="input input-sm input-bordered w-60"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
              />
            ) : (
              formData.fullName
            )}
          </h1>
          <p className="text-sm opacity-70">{authUser.email}</p>
        </div>

        <div className="flex gap-3">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            <Edit className="w-4 h-4 mr-1" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>

          {isEditing && (
            <button
              className="btn btn-success btn-sm"
              onClick={() => saveProfile(formData)}
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="label">Bio</label>
          {isEditing ? (
            <textarea
              className="textarea textarea-bordered w-full"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
            />
          ) : (
            <p className="text-base-content opacity-80">
              {formData.bio || 'No bio available'}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Location</label>
            {isEditing ? (
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            ) : (
              <p>{formData.location || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="label">Native Language</label>
            {isEditing ? (
              <select
                className="select select-bordered w-full"
                value={formData.nativeLanguage}
                onChange={(e) => handleChange('nativeLanguage', e.target.value)}
              >
                <option value="">Select</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang}>{lang}</option>
                ))}
              </select>
            ) : (
              <p>{formData.nativeLanguage || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="label">Learning Language</label>
            {isEditing ? (
              <select
                className="select select-bordered w-full"
                value={formData.learningLanguage}
                onChange={(e) => handleChange('learningLanguage', e.target.value)}
              >
                <option value="">Select</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang}>{lang}</option>
                ))}
              </select>
            ) : (
              <p>{formData.learningLanguage || 'N/A'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="mt-10">
        <h2 className="font-semibold mb-2">Profile Completion {completionEmoji}</h2>
        <progress
          className="progress progress-accent w-full"
          value={profileCompletion}
          max="100"
        ></progress>
        <p className="text-sm mt-1 text-accent-content">
          {profileCompletion}% complete — keep going!
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="stat bg-base-200 rounded-xl p-4">
          <div className="stat-title">Friends</div>
          <div className="stat-value">{authUser?.friends?.length || 0}</div>
          <div className="stat-figure text-primary">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="stat bg-base-200 rounded-xl p-4">
          <div className="stat-title">Requests Sent</div>
          <div className="stat-value">{authUser?.requestsSent || 0}</div>
          <div className="stat-figure text-warning">
            <BadgeCheck className="w-6 h-6" />
          </div>
        </div>
        <div className="stat bg-base-200 rounded-xl p-4">
          <div className="stat-title">Requests Accepted</div>
          <div className="stat-value">{authUser?.requestsAccepted || 0}</div>
          <div className="stat-figure text-success">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
