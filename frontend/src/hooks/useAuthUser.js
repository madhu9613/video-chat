import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../lib/api";

const useAuthUser = () => {
  const {
    data: authUser,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: fetchUserProfile,
    retry: false, // don’t retry on error
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return { authUser, isLoading, error, isError };
};

export default useAuthUser;
