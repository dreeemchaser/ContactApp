import React from 'react';

const Header = ( { toggleModal, nOfContacts } ) => {
    return (
        <header className='header'>
            <div className="container"> 
                <h3> Contact List ({nOfContacts})</h3>
                <button 
                    onClick={() => toggleModal(true)} 
                    className='btn'> <i className='bi bi-plus-square'></i>Add New Contact 
                </button>
             </div>
        </header>
    )
}


export default Header;