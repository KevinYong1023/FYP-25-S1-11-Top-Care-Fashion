import Product from '../../models/product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const productData = async () => {
  // Required for ES Modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

  const users = [
    { name: 'JJ', email: 'user001@mail.com', userId: 1 },
    { name: 'Tommy', email: 'user002@mail.com', userId: 2 },
    { name: 'Kevin Yong', email: 'user003@mail.com', userId: 9 },
  ];

  const occasions = ['Smart', 'Formal', 'Sport', 'Casual'];
  const categories = ['Top', 'Bottom', 'Footwear'];
  const descriptions = {
    Top: 'A comfortable and stylish top for various occasions.',
    Bottom: 'Comfortable and versatile bottoms for every situation.',
    Footwear: 'Stylish and functional footwear for your needs.',
  };

  const titleOptions = {
    Smart: {
      Top: ['Elegant Blouse', 'Sleek Dress Shirt', 'Modern Tunic'],
      Bottom: ['Tailored Trousers', 'Slim Fit Pants', 'Office Slacks'],
      Footwear: ['Leather Loafers', 'Classy Heels', 'Formal Flats'],
    },
    Formal: {
      Top: ['Silk Shirt', 'Button-Up Blazer', 'Polo Tux Shirt'],
      Bottom: ['Suit Pants', 'Dress Skirt', 'Pleated Trousers'],
      Footwear: ['Oxford Shoes', 'Polished Heels', 'Dress Boots'],
    },
    Sport: {
      Top: ['Dry-Fit Tee', 'Athletic Tank', 'Performance Shirt'],
      Bottom: ['Training Shorts', 'Running Pants', 'Compression Leggings'],
      Footwear: ['Running Shoes', 'Court Sneakers', 'Training Cleats'],
    },
    Casual: {
      Top: ['Relaxed Tee', 'Graphic Shirt', 'Henley Top'],
      Bottom: ['Cargo Shorts', 'Joggers', 'Denim Jeans'],
      Footwear: ['Canvas Sneakers', 'Slip-ons', 'Casual Sandals'],
    }
  };

  const products = [];

  occasions.forEach((occasion) => {
    categories.forEach((category) => {
      for (let i = 1; i <= 3; i++) {
        const randomUser = users[(i - 1) % users.length];
        const titlePool = titleOptions[occasion][category];
        const title = titlePool[Math.floor(Math.random() * titlePool.length)];

        const fileName = `${occasion}-${category}-${i}.png`;
        const filePath = path.resolve(__dirname, '../Data/images', fileName);// Image File Path: server\Test\Data\images\Casual-Bottom-3.png

        let base64Image = ''; 
        try {
          const imageBuffer = fs.readFileSync(filePath);
          base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
        } catch (err) {
          console.error(`Failed to read image: ${filePath}`, err);
        }

        const product = {
          title,
          description: descriptions[category],
          price: parseFloat((Math.random() * 100 + 100).toFixed(2)),
          category,
          occasion,
          imageUrl: base64Image,
          seller: randomUser.name,
          email: randomUser.email,
          userId: randomUser.userId,
          createdAt: new Date(),
          isOrdered: false,
        };
        products.push(product);
      }
    });
  });

  const insertedProducts = await Product.insertMany(products);
  console.log(`${insertedProducts.length} products created successfully.`);
};

export { productData };
