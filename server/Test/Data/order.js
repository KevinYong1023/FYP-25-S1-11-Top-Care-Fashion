import Order from '../../models/orders.js';
import Counter from '../../models/counter.js';
import Product from '../../models/product.js';

const orderData = async () => {
  await Order.deleteMany({});

  const counter = await Counter.findOneAndUpdate(
    { name: 'orderNumber' },
    { $set: { value: 1 } },
    { upsert: true, new: true }
  );

  const allProducts = await Product.find();

  // Group products by seller
  const productsBySeller = {};
  allProducts.forEach(product => {
    if (!productsBySeller[product.seller]) {
      productsBySeller[product.seller] = [];
    }
    productsBySeller[product.seller].push(product);
  });

  const orders = [];

  // --- ORDER 1: 2 products from 2 different sellers ---
  const sellerNames = Object.keys(productsBySeller);
  const selectedSellers = sellerNames.slice(0, 2); // Take first 2 sellers

  const order1Items = [];

  selectedSellers.forEach(seller => {
    const product = productsBySeller[seller]?.pop();
    if (product) {
      order1Items.push({
        sellerName: seller,
        productName: product.title,
        price: product.price,
        status: 'Processing',
      });
    }
  });

  const order1Total = order1Items.reduce((sum, item) => sum + item.price, 0);
  orders.push({
    orderNumber: counter.value++,
    seller: order1Items,
    created: new Date(),
    total: parseFloat(order1Total.toFixed(2)),
    status: 'Processing',
    buyerName: 'Kevin Yong',
  });

  // --- ORDER 2: 2 products from same seller ---
  const singleSeller = sellerNames.find(seller => (productsBySeller[seller]?.length || 0) >= 2);
  const order2Items = [];

  if (singleSeller) {
    const product1 = productsBySeller[singleSeller].pop();
    const product2 = productsBySeller[singleSeller].pop();

    if (product1 && product2) {
      order2Items.push(
        {
          sellerName: singleSeller,
          productName: product1.title,
          price: product1.price,
          status: 'Processing',
        },
        {
          sellerName: singleSeller,
          productName: product2.title,
          price: product2.price,
          status: 'Processing',
        }
      );
    }

    const order2Total = order2Items.reduce((sum, item) => sum + item.price, 0);
    orders.push({
      orderNumber: counter.value++,
      seller: order2Items,
      created: new Date(),
      total: parseFloat(order2Total.toFixed(2)),
      status: 'Processing',
      buyerName: 'Tommy',
    });
  }

  // Save to DB
  await Order.insertMany(orders);

  // Update isOrdered = true for all ordered products
  const orderedProductTitles = orders.flatMap(order =>
    order.seller.map(item => item.productName)
  );

  await Product.updateMany(
    { title: { $in: orderedProductTitles } },
    { $set: { isOrdered: true } }
  );

  await Counter.findOneAndUpdate(
    { name: 'orderNumber' },
    { $set: { value: counter.value } }
  );

  console.log('2 orders created successfully');
};

export { orderData };
