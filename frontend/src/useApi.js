import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useApi = () => {
  const [loading, setLoading] = useState(false);

  const apiCallWithToast = async (url, options = {}) => {
    setLoading(true);
    try {
      const response = await axios(url, options);

      const successMessage = response.data?.message || "Амжилттай";
      const errorMessage = response.data?.message || "Aлдаа";

      if (response.data?.status === "success") {
        toast.success(successMessage); // Success toast
      } else {
        toast.error(errorMessage); // Error toast
      }
      return response.data; 

    } catch (error) {
      // Handle errors, show error toast with specific message
      const errorMsg =
        error.response?.data?.message || "There was an issue with the request";
      toast.error(errorMsg);
    } finally {
      setLoading(false); // Set loading to false once the request is completed
    }
  };

  return { apiCallWithToast, loading };
};

export default useApi;
