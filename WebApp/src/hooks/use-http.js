import { useContext, useState } from 'react'
import AuthContext from '../store/auth-context';
import ENV from '../utils/env';

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const authCtx = useContext(AuthContext);

    const sendRequest = async (config,data, method) => {
        setIsLoading(true);
        setError(null);

        try {
            const header = config.headers ? { ...config.headers } : {'Content-Type': 'application/json', 'Accept': 'application/json'}
            const response = await fetch(
                `${ENV.apiURL}/${config.url}`,
                {
                    method: method ? method : "GET",
                    body: data ? JSON.stringify(data) : null,
                    headers: {
                        ...header,
                        'Authorization': `Bearer ${authCtx.token}`
                    }
                }
            );

            if(!response.ok) {
                setIsLoading(false);
                throw new Error(response.json());
            }

            setIsLoading(false);
            return response;
        } catch(error) {
            setIsLoading(false);
            throw new Error("Invalid operation");
        }
    };

    return {
        sendRequest,
        isLoading,
        error
    }
}

export default useHttp;