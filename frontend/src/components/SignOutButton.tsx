import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const SignOutButton = () => {

    const queryClient = useQueryClient();

    const navigate = useNavigate();
    
    const { showToast } = useAppContext();

    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken");
            showToast({ message: "Logged Out!", type: "SUCCESS"});
            navigate('/');
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR"});
        }
    });

    const handleClick = () => {
        mutation.mutate();
    }

    return(
        <button onClick={handleClick} className="text-blue-600 px-3 font-bold hover:bg-gray-100 bg-white">
            SignOut
        </button>
    )
}

export default SignOutButton;