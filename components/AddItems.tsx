import React, { useState, useRef } from "react";
import { storage, database } from "@/Firebase/firebase";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { update, ref } from "@firebase/database";
import { toast } from 'react-toastify';
import Image from "next/image";
import styles from './AddItems.module.css'
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";

interface AddItemsProps {
  userID: any;
}

const AddItems:React.FC<AddItemsProps> =({userID}) =>{
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const[itemName, setItemName] = useState<string>('');
    const[image, setImage] = useState<File | null>(null);

    const toastify = ()=>{
        toast.success('🔥 Added succesfully', {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e:any) => {
        const selectedFile = e.target.files?.[0];
        setImage(selectedFile);
    };

    const handleReset = () => {
        console.log(userID);
        setItemName('');
        setImage(null);
    }

    const handleBack = () => {
        router.replace('/dashboard');
    }

    const updateDetails = async(downloadURL:any) =>{
        try{
            const menuPath = ref(database, `users/${userID}/menu`);
            const itemData = {
                [itemName]: downloadURL,
            };
            await update(menuPath, itemData);
            toastify();
            setImage(null);
            setItemName('');
        }catch(e){
            console.log(e);
        }
    }

    const handleSubmit = async() => {
        if(!itemName.trim() || !image){
            toast.error('❌ Enter both Name and Image', {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        }
        else{
            toast.success('✅ Adding Item', {
                position: "top-center",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            const storageRef = sRef(storage);
            const imagesRef = sRef(storageRef, `${userID}`);
            const fileName = `${itemName}`;
            const spaceRef = sRef(imagesRef, fileName);
            try{
                await uploadBytes(spaceRef, image);
                const downloadURL = await getDownloadURL(spaceRef);
                updateDetails(downloadURL);
            }catch (error) {
                console.error('Error uploading image:', error);
                throw error;
            }
        }
    }
    return(
        <div className={styles.holder}>
            <Image src='/back-arrow.png' alt="Go back arrow" className={styles.goBack} onClick={handleBack} width={35} height={35}/>
            <div className={styles.inputItems}>
                <div className={styles.fastfood}>
                    <Image src='/fast-food.png' alt="Fast Food icon" width={40} height={40}/>
                </div>
                <p>Add a new item</p>
                <input type="text" onChange={(e)=>{setItemName(e.target.value)}} value={itemName} placeholder="Name of the food"/>
                <button type="button" onClick={handleClick} className={image?styles.button_purple:styles.button_orange}>{image?image.name:'Add Image'}</button>
                <input type="file" accept=".jpg, .jpeg, .png " ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                {/* {image && <p>Selected File: {image.name}</p>} */}
            </div>
            <div className={styles.buttons}>
                <button type="button" onClick={handleReset} className={styles.reset}>Reset</button>
                <button type="button" onClick={handleSubmit} className={styles.submit} >Add Item</button>
            </div>
            <p className={styles.warning}><span className={styles.asterick}>*</span>Images must have transparent background.</p> 
        </div>
    )
}

export default AddItems;