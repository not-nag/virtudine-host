import React from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/Firebase/firebase'

const checkAuthMiddleware = (callback: (uid:string | null)=>void) => {

    onAuthStateChanged(auth, (user)=>{
        if(user){
            const uid = user.uid;
            callback(uid);
        }
        else{
            callback(null);
        }
    })
}

export default checkAuthMiddleware;