import React from "react";
import styles from './IndividualItem.module.css'
import Image from "next/image";
import { useRouter } from "next/router";
import Card from "./Card";

interface IndividualItem{
    userData:any;
    uid:any;
    search:any;
}

const IndividualItem:React.FC<IndividualItem> = ({userData, uid, search})=>{
    let menuItems = null;
    if(userData.menu){
        menuItems = Object.entries(userData.menu);
    }
    const router = useRouter();
    const handleAdd = () => {
        router.replace('/dashboard/add');
    }


    return<>
        <Image src='/pizza.png' width={45} height={45} alt="Pizza Icon" className={styles.pizza}/>
        <div className={styles.body}>
            <div className={styles.heading}>
                <p>Menu</p>
                <button type="button" onClick={handleAdd} className={styles.redirect_button}>ADD ITEMS</button>
            </div>
        </div>
        {!menuItems?<h1 className={styles.noItem}>No Items added.</h1>:<Card menuItems={menuItems} uid={uid} search={search}/>}
    </>
}

export default IndividualItem;