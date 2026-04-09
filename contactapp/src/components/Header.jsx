import React from 'react';

const Header = ({ nOfContacts, children }) => {
    return (
        <header className='header'>
            <div className="container"> 
                <h3>Contact List ({nOfContacts})</h3>
                {children}
             </div>
        </header>
    )
}


export default Header;