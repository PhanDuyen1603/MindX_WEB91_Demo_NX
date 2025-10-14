import express from 'express';
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

const customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age:25 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age:30 }
];

const orders = [
  { id: 101, customerId: 1, product: 'Laptop', quantity: 1, totalPrice: 15000000 },
  { id: 102, customerId: 2, product: 'Phone', quantity: 2, totalPrice: 20000000 },
  { id: 103, customerId: 1, product: 'Mouse', quantity: 3, totalPrice: 300000 }
];

app.get('/customers', (req, res) => {
  res.json(customers);
});
app.get('/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const found = customers.find(c => c.id === id);

    if (!found) {
        return res.status(404).json({ message: 'Customer not found' });
    }
    // nếu tìm thấy customer thì trả về customer
    res.json(found);
}
);

app.get('/customers/:customerId/orders', (req, res) => {
  const customerId = parseInt(req.params.customerId);

  // lọc tất cả orders có customerId trùng khớp
  const customerOrders = orders.filter(order => order.customerId === customerId);

  // trả về danh sách orders (mảng rỗng nếu không có)
  res.json(customerOrders);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
