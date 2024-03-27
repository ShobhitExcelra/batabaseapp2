import { useSelector } from 'react-redux';
const useGetAccessToken = () => {
    const  userInfo = useSelector((state) => state.user);
    return userInfo ? userInfo.idToken : (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).idToken:'');
};
export default useGetAccessToken;
