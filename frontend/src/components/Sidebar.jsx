import {
  BellIcon,
  HomeIcon,
  Menu,
  ShipWheelIcon,
  UsersIcon
} from "lucide-react";
import { useLocation, Link } from "react-router";
import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { AnimatePresence, motion } from "framer-motion";

const NAV_ITEMS = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Friends", href: "/friends", icon: UsersIcon },
  { name: "Notification", href: "/notification", icon: BellIcon }
];

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [isOpen, setIsOpen] = useState(() => window.innerWidth >= 768 )

  return (
    <motion.div
      className={`h-screen sticky top-0 bg-base-300 border-r border-base-300 z-10`}
      initial={false}
      animate={{ width: isOpen ? 250 : 80 }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-full flex flex-col p-4" data-theme="dark">
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center  gap-2">
        
            {isOpen && (
                   
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold bg-gradient-to-r flex items-center justify-center gap-2 from-primary to-secondary text-transparent bg-clip-text"
              >
                 <ShipWheelIcon className="size-7 text-primary" />
                Tandemly
              </motion.span>
            )}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-sm btn-ghost ml-auto"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-8 space-y-2 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <motion.div
                  className={`flex items-center p-3 rounded-lg gap-3 transition-colors ${
                    isActive ? "bg-primary text-white" : "hover:bg-base-300"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <item.icon className="size-5" />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        className="whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="border-t border-base-300 pt-4">
          <div className="flex items-center gap-3">
            <Link to={"/profile"}>
            <div className={`${isOpen ?"avatar":"avatar avatar-online cursor-pointer"}`}>
              <div className="w-10 rounded-full">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
               </div>
              </Link>
           
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <p className="font-semibold text-sm">{authUser?.fullName}</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <span className="size-2 rounded-full bg-success inline-block" />
                    Online
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
