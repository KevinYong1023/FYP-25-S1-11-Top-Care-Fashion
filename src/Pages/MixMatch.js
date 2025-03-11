import React from 'react';  
import '../css/MixMatch.css'; // Ensure the CSS file is correctly linked  

const MixMatch = () => {  
    const products = {  
        top: [  
            { name: "Product 1", imageUrl: "path_to_image1.jpg", link: "link_to_product1" },  
            { name: "Product 2", imageUrl: "path_to_image2.jpg", link: "link_to_product2" },  
            { name: "Product 3", imageUrl: "path_to_image3.jpg", link: "link_to_product3" },  
        ],  
        bottom: [  
            { name: "Product 1", imageUrl: "path_to_image4.jpg", link: "link_to_product4" },  
            { name: "Product 2", imageUrl: "path_to_image5.jpg", link: "link_to_product5" },  
            { name: "Product 3", imageUrl: "path_to_image6.jpg", link: "link_to_product6" },  
        ],  
        footwear: [  
            { name: "Product 1", imageUrl: "path_to_image7.jpg", link: "link_to_product7" },  
            { name: "Product 2", imageUrl: "path_to_image8.jpg", link: "link_to_product8" },  
            { name: "Product 3", imageUrl: "path_to_image9.jpg", link: "link_to_product9" },  
        ],  
    };  

    return (  
        <div className="mixmatch-container">  
            <div className="mannequin">  
                <span className="mannequin-text">Mannequin</span>  
            </div>  
            <div className="categories">  
                {Object.entries(products).map(([category, items]) => (  
                    <div className="category" key={category}>  
                        <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>  
                        <div className="products">  
                            {items.map((product, index) => (  
                                <a href={product.link} className="product" key={index} target="_blank" rel="noopener noreferrer">  
                                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', borderRadius: '5px' }} />  
                                </a>  
                            ))}  
                        </div>  
                    </div>  
                ))}  
            </div>  
        </div>  
    );  
}  

export default MixMatch;  