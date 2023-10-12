import React, { useState } from 'react'
import Image from 'next/image';

import styles from './SearchItems.module.css'

interface SearchComponentProps {
  onSearch: (query: string) => void;
}

const SearchItems:React.FC<SearchComponentProps> = ({onSearch}) =>{

  const [search, setSearch] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setSearch(e.target.value);
    onSearch(e.target.value);
  }

    return(
        <div  className={styles.searchBar}>
          <input type="text" placeholder='Search specific item here' value={search} onChange={handleChange}/>
          <Image src='/search-logo.png' alt='Search icon' width={30} height={30} className={styles.icon}/>
        </div>
    )
}

export default SearchItems;