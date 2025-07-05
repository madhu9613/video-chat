import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { onboarding } from '../lib/api'
import toast from 'react-hot-toast'
import { CameraIcon, MapPinIcon, ShuffleIcon } from 'lucide-react'
import { LANGUAGES, POPULAR_LOCATIONS } from '../constant'
import LocationSelector from '../components/LocationSelector.jsx'

const OnboardingPage = () => {
  const { authUser } = useAuthUser()
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [locationSearch, setLocationSearch] = useState('')

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  })

  const queryClient = useQueryClient()

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: onboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
      toast.success("Profile Updated Successfully")
    },
    onError: (err) => {
      const message = err.response?.data?.message || "Something went wrong!"
      toast.error(message)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onboardingMutation(formData)
  }

  const getInitials = (fullName) => {
    return fullName
      .split(" ")
      .filter(Boolean)
      .map(word => word[0])
      .join("")
      .toUpperCase()
  }

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
    setFormData({ ...formData, profilePic: randomAvatar })
  }

  const handleLocationSelect = (location) => {
    setFormData({ ...formData, location })
    setIsLocationModalOpen(false)
  }

  const filteredLocations = POPULAR_LOCATIONS.filter(loc =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-4 lg:p-8">
      <div className="card bg-base-200 w-full max-w-3xl shadow-2xl" data-theme="dark">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-primary">Complete Your Profile</h1>

          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="avatar">
              <div className={`w-32 h-32 rounded-full ring ring-primary ${!formData.profilePic ? 'bg-neutral text-neutral-content' : ''}`}>
                {formData.profilePic ? (
                  <img src={formData.profilePic} alt="Profile" className="rounded-full object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-4xl">
                    {getInitials(formData.fullName)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={handleRandomAvatar} className="btn btn-primary btn-sm">
                <ShuffleIcon className="size-4 mr-2" /> Random Avatar
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => document.getElementById('profilePicInput').click()}
              >
                <CameraIcon className="size-4 mr-2" /> Upload
              </button>
              <input
                id="profilePicInput"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const reader = new FileReader()
                    reader.onloadend = () => setFormData({ ...formData, profilePic: reader.result })
                    reader.readAsDataURL(e.target.files[0])
                  }
                }}
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Full Name */}
            <label className="form-control w-full floating-label">
              <span className="label-text">Full Name</span>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="input input-bordered input-primary w-full"
                required
              />
            </label>

            {/* Email */}
            <label className="form-control w-full floating-label">
              <span className="label-text">Email</span>
              <input
                type="email"
                value={authUser?.email || ""}
                readOnly
                className="input input-bordered bg-base-300 text-base-content/50 cursor-not-allowed"
              />
            </label>

            {/* Native Language */}
            <label className="form-control w-full floating-label">
              <span className="label-text">Native Language</span>
              <select
                value={formData.nativeLanguage}
                onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                className="select select-bordered select-primary w-full"
              >
                <option value="">Select language</option>
                {LANGUAGES.map((lang) => (
                  <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                ))}
              </select>
            </label>

            {/* Learning Language */}
            <label className="form-control w-full floating-label">
              <span className="label-text">Learning Language</span>
              <select
                value={formData.learningLanguage}
                onChange={(e) => setFormData({ ...formData, learningLanguage: e.target.value })}
                className="select select-bordered select-secondary w-full"
              >
                <option value="">Select language</option>
                {LANGUAGES.map((lang) => (
                  <option key={`learning-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                ))}
              </select>
            </label>

            {/* Location Selector */}
            <label className="form-control md:col-span-2 floating-label">
              <span className="label-text">Location</span>
              <LocationSelector
                value={formData.location}
                onChange={(loc) => setFormData({ ...formData, location: loc })}
              />
            </label>

            {/* Bio */}
            <label className="form-control md:col-span-2 floating-label">
              <span className="label-text">Bio</span>
              <textarea
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="textarea textarea-bordered textarea-secondary w-full h-32"
              />
            </label>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-center mt-4">
              <button type="submit" disabled={isPending} className="btn btn-success btn-wide">
                {isPending ? <span className="loading loading-spinner" /> : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Location Modal (Optional if you use LocationSelector) */}
      {isLocationModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4">Select Location</h3>
            <div className="form-control mb-4">
              <input
                type="text"
                placeholder="Search locations..."
                className="input input-bordered"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
              />
            </div>
            <div className="max-h-96 overflow-y-auto">
              <ul className="menu bg-base-200 rounded-box">
                {filteredLocations.map((location) => (
                  <li key={location}>
                    <button
                      className={formData.location === location ? 'active' : ''}
                      onClick={() => handleLocationSelect(location)}
                    >
                      <MapPinIcon className="size-4" /> {location}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setIsLocationModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OnboardingPage
