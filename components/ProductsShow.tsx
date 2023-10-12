import React, { useState } from 'react'
import SignOut from './SignOut';
import styles from './ProductsShow.module.css'
import SearchItems from './SearchItems';
import IndividualItem from './IndividualItem';

interface ProductShowProps {
  userData: any;
  uid: any;
}

const ProductShow:React.FC<ProductShowProps> = ({userData, uid}) => {
    const [search, setSearch] = useState<string>('');

    const handleSearch = (query: string) => {
        setSearch(query);
    };

    return(
        <div className={styles.products}>
            <SearchItems onSearch={handleSearch}/>
            <SignOut />
            <IndividualItem userData = {userData} uid={uid} search={search}/>
        </div>
    )
}

export default ProductShow;