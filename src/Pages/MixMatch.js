import React from 'react';
import '../css/MixMatch.css';
import UserHeader from '../Components/Headers/userHeader';

const MixMatch = () => {
    const products = {
        top: [
            { name: "Product 1", imageUrl: "path_to_image1.jpg" },
            { name: "Product 2", imageUrl: "path_to_image2.jpg", link: "" },
            { name: "Product 3", imageUrl: "path_to_image3.jpg", link: "" },
        ],
        bottom: [
            { name: "Product 1", imageUrl: "path_to_image4.jpg", link: "" },
            { name: "Product 2", imageUrl: "path_to_image5.jpg", link: "" },
            { name: "Product 3", imageUrl: "path_to_image6.jpg", link: "" },
        ],
        footwear: [
            { name: "Product 1", imageUrl: "path_to_image7.jpg", link: "" },
            { name: "Product 2", imageUrl: "path_to_image8.jpg", link: "" },
            { name: "Product 3", imageUrl: "path_to_image9.jpg", link: "" },
        ],
    };

    return (
        <>
            <UserHeader loginStatus={true} />

            <div className="mixmatch-container">
                <div className="mannequin-containers">
                    
                    <div className="mannequin-top">
                        <span className="mannequin-text">Top</span>
                        {/* Top mannequin content here */}
                    </div>
                    <div className="mannequin-middle">
                        <span className="mannequin-text">Bottom</span>
                        {/* Middle mannequin content here (bottoms) */}
                    </div>
                    <div className="mannequin-bottom">
                        <span className="mannequin-text">Footwear</span>
                        {/* Bottom mannequin content here (footwear) */}
                    </div>
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
        </>
    );
};

export default MixMatch;