import Product from '../../../models/product.js';
import fs from 'fs';
import path from 'path';

// Image folder path in the project
const imagesPath = path.resolve('TestData', 'data', 'product', 'images'); 

const toBase64 = (relativePath) => {
    const filePath = path.resolve(imagesPath, relativePath);  // Combine base path and the relative path of image
    console.log('Reading image from:', filePath);  // Log the full path to debug
    const imageBuffer = fs.readFileSync(filePath);  // Read the image file as buffer
    return `data:image/png;base64,${imageBuffer.toString('base64')}`;  // Return the base64 string with MIME type
  };
  

const productData = async () => {
  // await Product.deleteMany({});

  const products = [
    {
      title: 'Slim Fit Tank Top',
      description: 'A comfortable and stylish slim fit t-shirt for sport outings.',
      price: 29.99,
      category: 'Top',
      occasion: 'Sport',
      imageUrl: toBase64('top1.png'),  // Corrected path as string
      seller: 'Tommy',
      email: 'user002@mail.com',
      userId: 2,
      createdAt: new Date(),
      isOrdered: false,
    },
    {
      title: 'Basketball Jersey',
      description: 'Limited edition.',
      price: 59.99,
      category: 'Top',
      occasion: 'Sport',
      imageUrl: toBase64('top2.png'),  // Corrected path as string
      seller: 'JJ',
      email: 'user001@mail.com',
      userId: 1,
      createdAt: new Date(),
      isOrdered: false,
    },
    {
      title: 'Short',
      description: 'A classic short for outdoor occasions.',
      price: 29.99,
      category: 'Bottom',
      occasion: 'Casual',
      imageUrl: toBase64('bottom2.png'),  // Corrected path as string
      seller: 'Tommy',
      email: 'user002@mail.com',
      userId: 2,
      createdAt: new Date(),
      isOrdered: false,
    },
    {
      title: 'Long Pants',
      description: 'A classic short for dinner occasions.',
      price: 29.99,
      category: 'Bottom',
      occasion: 'Smart',
      imageUrl: toBase64('bottom1.png'),  // Corrected path as string
      seller: 'JJ',
      email: 'user001@mail.com',
      userId: 1,
      createdAt: new Date(),
      isOrdered: false,
    },
    {
      title: 'Sneaker Shoe',
      description: 'Basketball shoe.',
      price: 29.99,
      category: 'Footwear',
      occasion: 'Sport',
      imageUrl: toBase64('footwear1.png'),  // Corrected path as string
      seller: 'JJ',
      email: 'user001@mail.com',
      userId: 1,
      createdAt: new Date(),
      isOrdered: false,
    },
    {
      title: 'Sandals',
      description: 'A classic short for dinner occasions.',
      price: 29.99,
      category: 'Footwear',
      occasion: 'Casual',
      imageUrl: toBase64('footwear2.png'),  // Corrected path as string
      seller: 'Tommy',
      email: 'user002@mail.com',
      userId: 2,
      createdAt: new Date(),
      isOrdered: false,
    },
  ];

  // Insert the products into the database
  const insertedProducts = await Product.insertMany(products);
  console.log(`${insertedProducts.length} products created successfully.`);
};

export { productData };
