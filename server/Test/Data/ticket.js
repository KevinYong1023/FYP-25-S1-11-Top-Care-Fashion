import Tickets from '../../models/tickets.js';
import Counter from '../../models/counter.js';
import Order from '../../models/orders.js';

const ticketData = async () => {
  await Tickets.deleteMany({});

  const counter = await Counter.findOneAndUpdate(
    { name: 'ticketId' },
    { $set: { value: 1 } },
    { upsert: true, new: true }
  );

  const orders = await Order.find();
  if (orders.length === 0) {
    console.log("⚠️ No orders found. Cannot create tickets.");
    return;
  }

  // Shuffle and pick up to 3 orders
  const selectedOrders = orders.sort(() => 0.5 - Math.random()).slice(0, 3);

  const descriptions = [
    "Issue with item not received.",
    "Wrong product delivered.",
    "Need to change delivery address."
  ];

  const TicketData = selectedOrders.map((order, index) => ({
    ticketId: counter.value++,
    orderId: order.orderNumber,
    user: order.buyerName,
    description: descriptions[index % descriptions.length],
    status: 'Open',
    assignee: '', 
    created: new Date()
  }));

  await Tickets.insertMany(TicketData);

  await Counter.findOneAndUpdate(
    { name: 'ticketId' },
    { $set: { value: counter.value } }
  );

  console.log("2 Tickets created and ticketId counter updated.");
};

export { ticketData };
