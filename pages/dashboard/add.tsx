import React, {useState, useEffect} from 'react'
import checkAuthMiddleware from '@/middleware/checkAuthMiddleware'
import {useRouter} from 'next/router';
import { ToastContainer } from 'react-toastify';
import AddItems from '@/components/AddItems';

import Background from '@/components/Background';

const Add:React.FC = () => {
    const router = useRouter();
    const [id, setId] = useState<string>('');

    useEffect(() => {
      checkAuthMiddleware((uid)=>{
            if(uid){
                setId(uid);
            }
            else{
                router.replace('/');
            }
        })
    }, [])
    
    return<>
        <Background />
        <AddItems userID={id}/>
        <ToastContainer />
    </>
}

export default Add;