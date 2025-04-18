import Comments from '../../models/comments.js';
import Counter from '../../models/counter.js';
import Product from '../../models/product.js';

const commentData = async () => {
  await Comments.deleteMany({});

  const counter = await Counter.findOneAndUpdate(
    { name: 'commentNo' },
    { $set: { value: 1 } },
    { upsert: true, new: true }
  );

  const allProducts = await Product.find();
  const allUsers = ['Kevin Yong', 'JJ', 'Tommy'];
  const sampleComments = [
    "Great quality and fits well.",
    "Stylish and perfect for the occasion.",
    "Good value for money.",
    "Highly recommended!",
    "Comfortable and looks great.",
    "Would definitely buy again.",
    "Design is amazing and modern.",
    "Product exceeded expectations.",
    "Exactly what I was looking for."
  ];

  // Shuffle the products and slice 4 max
  const shuffledProducts = allProducts.sort(() => 0.5 - Math.random()).slice(0, 4);

  const comments = [];

  for (const product of shuffledProducts) {
    const possibleCommenters = allUsers.filter(user => user !== product.seller);
    const madeBy = possibleCommenters[Math.floor(Math.random() * possibleCommenters.length)];
    const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];

    comments.push({
      commentNo: counter.value++,
      description: randomComment,
      product: product.title,
      madeBy: madeBy,
      created: new Date(),
    });
  }

  await Comments.insertMany(comments);

  await Counter.findOneAndUpdate(
    { name: 'commentNo' },
    { $set: { value: counter.value } }
  );

  console.log(`${comments.length} comments created and counter updated.`);
};

export { commentData };
