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

const AddItems: React.FC<AddItemsProps> = ({ userID }) => {
  const router = useRouter();
  const objectInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const[itemName, setItemName] = useState<string>('');
  const[ingredients, setIngredients] = useState<string>('');
  const[image, setImage] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const handleClear = () => {
    setItemName('');
    setImage(null);
    setThumbnail(null);
    setIngredients('');
  
    // Clear file input fields
    if (objectInputRef.current) {
      objectInputRef.current.value = '';
    }
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };
  

  const imgClick = () => {
    thumbnailInputRef.current?.click();
  };

  const handleClick = () => {
    objectInputRef.current?.click();
  };

  const handleThumbnailChange = (e: any) => {
    const selectedFile = e.target.files?.[0];
    setThumbnail(selectedFile);
  };

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files?.[0];
    setImage(selectedFile);
  };

  const handleReset = () => {
    setItemName('');
    setImage(null);
    setThumbnail(null);
    setIngredients('');
  };

  const handleBack = () => {
    router.replace('/dashboard');
  };

  const uploadAndAddItem = async () => {
    if (!itemName.trim() || !image || !thumbnail || !ingredients.trim()) {
      toast.error('❌ Enter Name, Image, and Ingredients', {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      toast.success('Adding Item. Please wait. This may take a minute.', {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      const storageRef = sRef(storage);
      const imagesRef = sRef(storageRef, `${userID}`);
      const fileName = `${itemName}`;
      const showName = `show${itemName}`;
      const spaceRef = sRef(imagesRef, fileName);
      const showRef = sRef(imagesRef, showName);

      try {
        await uploadBytes(spaceRef, image);
        await uploadBytes(showRef, thumbnail);
        const downloadURL = await getDownloadURL(spaceRef);
        const showURL = await getDownloadURL(showRef);

        const menuPath = ref(database, `users/${userID}/menu`);
        const itemData = {
          [itemName]: {
            downloadURL,
            ingredients,
            showURL,
          }
        };

        await update(menuPath, itemData);

        toast.dismiss(); // Close the "Adding item" toast
        toast.success('🔥 Added successfully', {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        
        handleClear();
      } catch (error) {
        toast.dismiss(); // Close the "Adding item" toast
        toast.error('Error adding item', {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        console.error('Error uploading image or updating database:', error);
      }
    }
  };

  return (
    <div className={styles.holder}>
      <Image src='/back-arrow.png' alt="Go back arrow" className={styles.goBack} onClick={handleBack} width={35} height={35}/>
      <div className={styles.inputItems}>
        <div className={styles.fastfood}>
          <Image src='/fast-food.png' alt="Fast Food icon" width={40} height={40}/>
        </div>
        <p>Add a new item</p>
        <input type="text" onChange={(e) => { setItemName(e.target.value) }} value={itemName} placeholder="Name of the food"/>
        <div className={styles.inputFiles}>
          <button type="button" onClick={handleClick} className={image ? styles.button_purple : styles.button_orange}>{image ? image.name : 'Add 3D File'}</button>
          <button type="button" onClick={imgClick} className={thumbnail ? styles.button_purple : styles.button_orange}>{thumbnail ? thumbnail.name : 'Add 2D Thumbnail'}</button>
        </div>
        <input className={styles.ingredients} type="text" onChange={(e) => { setIngredients(e.target.value) }} value={ingredients} placeholder="Enter the Ingredients"></input>
        <input type="file" accept=".gltf, .glb, .obj" ref={objectInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
        <input type="file" accept=".png, .jpg, .jpeg" ref={thumbnailInputRef} onChange={handleThumbnailChange} style={{ display: 'none' }} />
      </div>
      <div className={styles.buttons}>
        <button type="button" onClick={handleReset} className={styles.reset}>Reset</button>
        <button type="button" onClick={uploadAndAddItem} className={styles.submit}>Add Item</button>
      </div>
      <p className={styles.warning}><span className={styles.asterisk}>*</span>Only 3D objects are accepted.</p>
    </div>
  );
}

export default AddItems;
