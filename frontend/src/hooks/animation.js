import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const useAOS = (options = {}) => {
  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: true,
      ...options, // override defaults per page
    });

    const refreshTimeout = setTimeout(() => AOS.refresh(), 500);
    return () => clearTimeout(refreshTimeout);
  }, [options]);
};

export default useAOS;