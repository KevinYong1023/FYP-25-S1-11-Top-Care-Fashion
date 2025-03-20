import React, { useState } from 'react';
import '../css/MixMatch.css';
import UserHeader from '../Components/Headers/userHeader';
import imageTest from '../mockdata/readImageTest';

const MixMatch = () => {
 
    const [selectedImages, setSelectedImages] = useState({
        top: null,
        bottom: null,
        footwear: null,
    });

    // Function to update the selected image for a category
    const handleSelectImage = (category, imageUrl) => {
        setSelectedImages((prev) => ({
            ...prev,
            [category]: imageUrl,
        }));
    };

    const products = {
        top: [
            { name: "Product 1", imageUrl: imageTest.image1},
            { name: "Product 2", imageUrl: imageTest.image2},
            { name: "Product 3", imageUrl: imageTest.image4},
        ],
        bottom: [
            { name: "Product 1", imageUrl: imageTest.image5},
            { name: "Product 2", imageUrl: imageTest.image6},
            { name: "Product 3", imageUrl: imageTest.image7},
        ],
        footwear: [
            { name: "Product 1", imageUrl: imageTest.image8},
            { name: "Product 2", imageUrl: imageTest.image9},
            { name: "Product 3", imageUrl: imageTest.image10},
        ],
    };

    return (
        <>
            <UserHeader loginStatus={true} />

            <div className="mixmatch-container">
                {/* Mannequin Container */}
                <div className="mannequin-containers">
                    
                    <div className="mannequin-top">
                        {!selectedImages.top ? (<span className="mannequin-text">Top</span>) : 
                        (
                            <img 
                                src={selectedImages.top} 
                                alt="Selected Top" 
                                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px" }} 
                            />
                        )}
                    </div>
                    <div className="mannequin-middle">
                        {!selectedImages.bottom ? (<span className="mannequin-text">Bottom</span>) : 
                        (
                            <img 
                                src={selectedImages.bottom} 
                                alt="Selected Bottom" 
                                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px" }} 
                            />
                        )}
                    </div>
                    <div className="mannequin-bottom">
                    {!selectedImages.footwear ? (<span className="mannequin-text">Footwear</span>) : 
                        (
                            <img 
                                src={selectedImages.footwear} 
                                alt="Selected Footwear" 
                                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px" }} 
                            />
                        )}
                    </div>
                </div>

                <div className="categories">
                    {Object.entries(products).map(([category, items]) => (
                        <div className="category" key={category}>
                            <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                            <div className="products">
                                {items.map((product, index) => (
                                    <a  className="product" key={index} target="_blank" rel="noopener noreferrer">
                                        <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', borderRadius: '5px' }} 
                                        onClick={ () => handleSelectImage(category, product.imageUrl)} />
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
