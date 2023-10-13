import Background from '@/components/Background'
import React, { useEffect, useState } from 'react'
import checkAuthMiddleware from '@/middleware/checkAuthMiddleware'
import { useRouter } from 'next/router'
import ProductShow from '@/components/ProductsShow'
import { getDatabase, ref, child, get } from 'firebase/database'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Products:React.FC = () =>{
    const [ authenticated, setAuthenticated ] = useState<boolean>(false);
    const [id, setId] = useState<string>('');
    const router = useRouter();
    const [userData, setUserData] = useState(null);

     const toastify = ()=>{
        toast.success('⌛ Loading Components', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
   

    useEffect(()=>{
        toastify();
        checkAuthMiddleware((uid)=>{
            if(uid){
                setId(uid);
                const dbRef = ref(getDatabase());
                get(child(dbRef, `users/${uid}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        setUserData(data);
                        setAuthenticated(true);

                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
            else{
                router.replace('/');
            }
        })

    }, [router])


    if(authenticated){
        return<>
            <Background />
            <ProductShow userData={userData} uid={id}/>
            <ToastContainer />
        </>
    }
    else{
        return null;
    }
}


export default Products;