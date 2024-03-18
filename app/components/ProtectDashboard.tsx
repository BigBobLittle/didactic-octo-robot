
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";

const requireAuthentication = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const WithAuthentication = (props: P) => {
    const router = useRouter();

     useEffect(() => {
       const token = localStorage.getItem("authToken");

       if(!token) {
         router.push("/");
       }

       // Check if token is present and not expired
      //  if (token) {
      //   console.log({token})
      //    try {
      //      const decodedToken: any = jwtDecode(token);
      //      const currentTime = Date.now() / 1000; // Get current time in seconds

      //      // Check if token expiry time is in the past
      //      if (decodedToken.exp < currentTime) {
      //        // Token is expired, redirect user to login page
      //        router.push("/");
      //      }
      //    } catch (error) {
      //      console.error("Error decoding JWT token:", error);
      //    }
      //  } else {
      //    // Token is not present, redirect user to login page
      //    console.log("No token found");
      //    router.push("/");
      //  }
     }, [router]);

    // If the user is authenticated, render the wrapped component
    return <WrappedComponent {...props} />;
  };

  return WithAuthentication;
};

export default requireAuthentication;
