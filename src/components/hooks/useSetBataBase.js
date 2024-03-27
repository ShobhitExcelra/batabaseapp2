import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addBatabase } from "../../utils/batabaseSlice";
import axios from "axios";
import useGetAccessToken from "./useGetAccessToken";

const useSetBataBase = () => {
  const dispatch = useDispatch();
  let token = useGetAccessToken();
  const callBataBaseAPI = () => {
    if(token){
      axios
      .get(`${process.env.REACT_APP_API_ROOT}/batabases`, {
        headers: {
          accept: "application/json",
          authorization: token,
        },
      })
      .then((response) => {
        dispatch(addBatabase({ batabaseAPI: response.data }));
        localStorage.setItem("batabaseAPI", btoa(JSON.stringify(response.data)));
      })
      .catch((err) => console.error(err));
    }
   };
  useEffect(() => {
    if (!localStorage.getItem("batabaseAPI")) {
      callBataBaseAPI();
    }
  }, [token]);
};
export default useSetBataBase;
