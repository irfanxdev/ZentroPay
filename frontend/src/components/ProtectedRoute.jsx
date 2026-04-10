    import { useEffect } from "react";
    import {Navigate} from "react-router-dom";

    function ProtectedRoute({children}){
        const [isAuth,setIsAuth]=useState(null);
        useEffect(()=>{
            const checkAuth=async () =>{
                try{
                    await API.get("auth/dashboard");
                    setIsAuth(true);
                }catch{
                    setIsAuth(false);
                }
            }
            checkAuth()
        },[])
        if(isAuth===null) return <p>Loading...</p>;
        return isAuth ? children :<Navigate to="/login"/>
    }

    export default ProtectedRoute;