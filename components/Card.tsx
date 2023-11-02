import React, {useState} from 'react'
import styles from './Card.module.css'
import Image from 'next/image'
import { toast } from 'react-toastify';
import { database, storage} from '@/Firebase/firebase'
import {ref, remove} from 'firebase/database'
import { useRouter } from 'next/router'
import { ref as sRef, deleteObject } from 'firebase/storage';

interface Card{
    menuItems:any;
    uid:any;
    search:any;
}

const Card:React.FC<Card> = ({menuItems, uid, search}) =>{

    const router = useRouter();

    const filteredMenuItems = menuItems.filter((item: any) => {
        return item[0].toLowerCase().includes(search.toLowerCase());
    });


    console.log(filteredMenuItems);

    const deleteFile = async(item:any) =>{
        const imageRef = sRef(storage, `${uid}/${item}`);
        const showRef = sRef(storage, `${uid}/show${item}`);
        try{
            await deleteObject(imageRef);
            await deleteObject(showRef);
        }catch(err){
            console.error(err);
        }
    }

    const deleteEntry = async(item:any) =>{
        const path = ref(database, `users/${uid}/menu/${item}`);
        
        try{
            await remove(path);
        }catch(err){
            console.error(err);
        }
    }

    const handleDelete = async(item:any) => {
        const userConfirmed = window.confirm("Confirm whether to delete this item.");
        if(userConfirmed){
            try{
                toast.success('✅ Deleting Item', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                await Promise.all([deleteEntry(item), deleteFile(item)]);
                router.reload();
            }catch(error){
                toast.error('❌ Deletion failed', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        }
    }


    return( 
    <div className={styles.card_holder}>
        <div className={styles.cardContainer}>
            {filteredMenuItems.length === 0 ? (
                <h1 className={styles.noItem}>No Items match your search.</h1>
             ) : (
            filteredMenuItems.map((item: any, customIndex: any) => (
                <div key={customIndex} className={styles.card}>
                <span className={styles.delete} onClick={() => handleDelete(item[0])}>
                ❌
                </span>
                <Image src={item[1]['showURL']} alt="Item Image" width={190} height={190} className={styles.image} />
                <div className={styles.pHolder}>
                    <p>{item[0]}</p>
                </div>
                </div>
            ))
        )}
        </div>
    </div>);    
}

export default Card;