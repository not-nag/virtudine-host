import React from 'react'
import styles from './SignOut.module.css'
import { signOut } from 'firebase/auth'
import { auth } from '@/Firebase/firebase'
import { useRouter } from 'next/router'
const SignOut:React.FC = () => {
    const router = useRouter();

    const handleLogout = () => {
        signOut(auth)
        .then(()=>{
            router.replace('/')
        })
        .catch((error)=>{
            console.error("Signout error "+error);
        })
    }

    return(
        <button className={styles.signout} onClick={handleLogout}>Log out</button>
    )
}

export default SignOut;