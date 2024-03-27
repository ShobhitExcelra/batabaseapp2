import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";

const useSetAccessToken = () => {
  const { instance } = useMsal();
  const dispatch = useDispatch();
  var request = {
    scopes: ["User.Read"],
  };
  const getAuthToken = async () => {
    instance
      .acquireTokenSilent(request)
      .then((tokenResponse) => {
        // Do something with the tokenResponse
        dispatch(addUser({ idToken: tokenResponse.idToken }));
      })
      .catch((error) => {
        // console.log(error);
        // handle other errors
      });
  };
  useEffect(() => {
    getAuthToken();
  }, []);
};
export default useSetAccessToken;
