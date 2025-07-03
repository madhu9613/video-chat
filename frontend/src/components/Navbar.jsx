import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { Link, useLocation, useNavigate } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout } from '../lib/api'
import { toast } from 'react-hot-toast'
import { BellIcon, LogOutIcon, ShipWheelIcon } from 'lucide-react'

const Navbar = () => {

     
    const { authUser } = useAuthUser()
    const location = useLocation()
    const isLogo = location.pathname?.startsWith("/chat") || location.pathname?.startsWith("/call")
    const queryClient = useQueryClient()

    const { mutate: logoutMutation } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["authUser"] }); // make sure cache is cleared
            toast.success("Logged out successfully");
           
        },
        onError: (err) => {
            const msg = err.response?.data?.message || "Something went wrong";
            toast.error(msg);
        },
    });

    return (
        <div

            className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'

            data-theme="dark"
           
        >
            <div className='
        container mx-auto px-4 sm:px-6 lg:px-8
        '>

                <div className='flex items-center justify-end w-full'>

                    {/* {logo} */}
                    {
                        isLogo &&
                        <Link
                            to="/"
                        >
                            <div
                                className="text-2xl font-bold bg-gradient-to-r flex items-center justify-center gap-2 from-primary to-secondary cursor-pointer text-transparent bg-clip-text"
                            >
                                <ShipWheelIcon className="size-7 text-primary" />
                                Tandemly
                            </div>
                        </Link>
                    }

                    <div className='flex items-center gap-3 sm:gap-4'>
                        <Link to={"/notification"}>
                            <button className='btn btn-ghost btn-circle'>
                                <BellIcon className='h-6 w-6 text-base-content opacity-70' />
                            </button>

                        </Link>
                       
                       <Link to={"/profile"}>
                        <div className='avatar avatar-online cursor-pointer'>
                            <div className='w-9 rounded-full'>
                                <img src={authUser?.profilePic} alt="" />

                            </div>


                        </div>
                        </Link>

                        <button className='btn btn-ghost btn-circle' onClick={logoutMutation}>
                            <LogOutIcon className='h-6 w-6 text-base-content opacity-70' />
                        </button>
                    </div>

                </div>



            </div>




        </div>
    )
}

export default Navbar