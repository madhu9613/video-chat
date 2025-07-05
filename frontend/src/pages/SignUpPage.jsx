import React, { useState } from 'react'
import { ShipWheelIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { Link } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import { signup } from '../lib/api';

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient=useQueryClient()

const {mutate,isPending,error}=useMutation({
  mutationFn: signup,
  onSuccess:()=>{queryClient.invalidateQueries({queryKey:["authUser"]})
 toast.success("Signup Successfully")
  },
  onError:(err)=>{
   const message =
      err?.response?.data?.message || "❌ Signup failed. Please try again.";
    toast.error(message);
  }
})


  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("userData", signupData);
    mutate(signupData)

  };

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' >
      <div className='border border-primary/25 flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-base-200 rounded-xl shadow-lg overflow-hidden' data-theme="">
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
          {/* Logo */}
          <div className='mb-4 flex items-center justify-start gap-2'>
            <ShipWheelIcon className="size-9 text-primary" />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide'>Tandemly</span>
          </div>

          <div className='w-full'>
            <form onSubmit={handleSubmit}>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-xl font-semibold'>Create Your Account</h2>
                  <p className='text-sm opacity-70'>
                    Join Tandemly — it's fun, smooth, and helps you connect with people!
                  </p>
                </div>

                <div className='space-y-3'>
                  {/* Full Name */}
                  <div className='form-control w-full'>
                    <label className="floating-label">
                      <input
                        type="text"
                        placeholder="FullName"
                        value={signupData.fullName}
                        required
                        onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                        className="input input-sm"
                      />
                      <span className='text-2xl font-semibold text-primary'>Full Name</span>
                    </label>
                  </div>

                  {/* Email */}
                  <div className='form-control w-full'>
                    <label className="floating-label">
                      <input
                        type="email"
                        placeholder="Email"
                        value={signupData.email}
                        required
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        className="input input-sm"
                      />
                      <span className='text-2xl font-semibold text-primary'>Email</span>
                    </label>
                  </div>

                  {/* Password with Eye Toggle */}
                  <div className="form-control w-full relative ">
                    <label className="floating-label ">
                      <input
                    type='password'
                        placeholder="Password"
                        value={signupData.password}
                        required
                        onChange={(e) =>
                          setSignupData({ ...signupData, password: e.target.value })
                        }
                        className="input input-sm  pr-10"
                      />
                      {/* 🛠 Fixed label text styling */}
                      <span className="text-base font-medium text-primary leading-tight">
                        Password
                      </span>

                      <p className='text-sm opacity-70 mt-3 underline font-bold ' >
                        Password must be at least 6 characters long
                      </p>
                    </label>



                  </div>

                  <div className='form-control'>
                    <label htmlFor="
                       " className='label cursor-pointer justify-start gap-2'>
                      <input type="checkbox" className='checkbox chekbox-sm' required />

                      <span className='text-xs text-primary leading-tight '>
                        I agree to the{" "}

                        <span className='text-secondary hover:underline'>term of service</span> {"  "} {" and "}
                        <span className='text-secondary hover:underline'>privacy policy</span>
                      </span>
                    </label>

                  </div>


                </div>
                {/* Submit Button */}
                <button className='btn btn-primary w-full  mt-4' type="submit">
                 {
                  isPending? (
                    <>
                    <span className='loading loading-spinner loading-xs'></span>
                     loading
                    </>
                  ):(
                    "Create Account"
                  )
                 }
                </button>

                <div className='text-center mt-4'>
                  <p className='text-sm'>
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className='hidden md:flex w-full md:w-1/2 bg-primary/5 items-center justify-center'>
          <div className='max-w-md p-8'>
            <div className='relative aspect-square max-w-sm max-auto'>
              <img src="/Video-call-rafiki.png" className='w-full h-full' alt="" />
              
              </div> 

              <div className='text-center space-y-3 mt-6'>
                    <h2 className='
                   text-xl font-semibold text-primary underline underline-offset-2
                    '>Connect with People</h2>
                    <p className='opacity-70 text-secondary'>
                      Make friend,Practice conversations,Fun 
                
                    </p>
               </div>



          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
