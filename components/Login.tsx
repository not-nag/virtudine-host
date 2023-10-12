/* Comments are generated by ChatGPT for future references */
// Import React library to create React components
import React from "react";

// Import CSS module for styling (assuming it's in the same directory)
import styles from './Login.module.css';

// Import the Details component from a local file
import Details from "./Details";


// Define a functional React component named Login
const Login: React.FC = () => {
    return(
        // Start rendering a div element with a CSS class from the imported module
        <div className={styles.container}>
            {/* Start rendering a nested div element with a CSS class from the imported module */}
            <div className={styles.round}>
                {/* Render an h1 element with a message */}
                <h1>Welcome to <span>VirtuDine</span>.</h1>
                {/* Render the GoogleButton component */}
                <Details />
            </div>
        </div>
    )
}

// Export the Login component as the default export of this module
export default Login;
