import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function UserWrapper({ children }: { children: React.ReactNode }) {

    const [verified, setVerified] = useState<boolean | null>(true);

    // useEffect(() => {
    //     const verifyUser = async () => {
    //         try {
    //             const res = await axios.get(`http://localhost:5000/api/user/verify`, {
    //                 withCredentials: true
    //             });

    //             if (res.status === 200) {
    //                 setVerified(true);
    //             }
    //         } catch (error) {
    //             <Navigate to="/auth/login" replace />;
    //         }
    //     }

    //     verifyUser();
    // }, []);

    // if (verified === null) return null;

    if (!verified) return <Navigate to="/auth/login" replace />;

    return <>{children}</>;
}

export default UserWrapper