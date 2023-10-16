import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';

import styles from './Details.module.css';

import Image from 'next/image';

import { GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth, database } from '../Firebase/firebase'
import { FirebaseError } from 'firebase/app';
import { get, set, ref, update, push } from 'firebase/database'

const Details: React.FC = () => {
    const router = useRouter();
    const [newUser, setNewUser] = useState<boolean>(false);
    const [cafeName, setCafeName] = useState<string>("");
    const [userId, setUserId] = useState<string>("");

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if (event.key === 'Enter'){
            handleCafeName();
        }
    }

    const handleCafeName = async() => {
        const userData = {
                cafeName,
        };
        const cafeData = {
            [userId]:cafeName,
        };
        const userRef = ref(database, `users/${userId}`);
        const cafeRef = ref(database, `cafes`);
        await set(userRef, userData)
            .then(async() => {
                await update(cafeRef, cafeData)
                .then(()=>{
                    console.log("Cafe sub-details set successfully")
                })
                .catch((e)=>{
                    console.error(e);
                });
                setPersistence(auth, browserLocalPersistence)
                .then(()=>{
                    router.push('/dashboard');
                })
                .catch(()=>{
                    console.log("Setting persistence caused error");
                })
            })
            .catch((error: FirebaseError) => {
                console.error('Error saving user data:', error);
        });
    }

    const handleChange = (event:ChangeEvent<HTMLInputElement>) =>{
        setCafeName(event.target.value)
    }

    const handleSignInWithGoogle = async() =>{
        const provider = new GoogleAuthProvider();

        try{
            provider.setCustomParameters({prompt: 'select_account'})
            const result = await signInWithPopup(auth, provider);
            const user = result.user
            const uid = user?.uid;
            if(!uid){
                console.error("UID not available");
                return
            }
            setUserId(uid);
            const userRef = ref(database, `users/${uid}`);

            get(userRef).then((snapshot)=>{
                if(snapshot.exists()){
                    setPersistence(auth, browserLocalPersistence).then(()=>{
                        router.push('/dashboard');
                    }).catch(()=>{
                        console.log("Setting persistence caused error");
                    })
                }
                else{
                    setNewUser(true);
                }
            })

        }
        catch(error){
            console.error("Google Sign In error "+error)
        }
    }

    return<>
        {!newUser ?( 
            <button className={styles.styledGoogle} onClick={handleSignInWithGoogle}>
            <Image src='/google-logo.png' alt='Google Logo' height={35} width={35} />
            <p>Sign In with Google</p>
            </button>):(
            <div className={styles.cafe_name}>
                <p>Let us cook some Magic<span>✨</span></p>
                <div className={styles.input}>
                    <input type='text' placeholder="Type your Cafe's name " maxLength={15} value={cafeName} onChange={handleChange} onKeyDown={handleEnter}></input>
                    <h1 onClick={handleCafeName}>-&gt;</h1>
                </div>
            </div>
        )}
    </>;
}

export default Details;
