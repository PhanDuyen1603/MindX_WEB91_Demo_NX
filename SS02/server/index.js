import express from 'express';
import { products } from './data.js';
import { customers } from './data.js';
import { orders } from './data.js';

const app = express();

//1. lay toan bo danh sach khach hang
app.get('/customers', (req, res) => {
  res.json(customers);
});

// 2. Lấy thông tin chi tiết của một khách hàng
// Viết API để lấy thông tin chi tiết của một khách hàng dựa trên id.
// Endpoint: GET /customers/:id
// Ví dụ:
//  /customers/c001 -> trả về thông tin customer có id là 1 =>< Nguyen van A
// /customers/2   -> trả về thông tin customer có id là 2
// :id sẽ đại diện như một biến trên url
// Yêu cầu: Trả về thông tin của một khách hàng cụ thể dựa trên id được truyền vào URL
app.get('/customers/:id', (req, res) => {
  const id = req.params.id;// người dùng truyền vào id trên url id = c005
  const customer = customers.find(c => c.id === id); //lấy cái customer đầu tiên có id trùng với id truyền vào customer = {id: 'c005', name: 'Nguyen van E', age: 22, address: 'Da Nang'}

  if(!customer) {
    return res.status(404).json({message: 'Customer not found'});
  }
  res.json(customer);
});

// 3. Lấy danh sách đơn hàng của một khách hàng cụ thể
// Viết API để lấy danh sách các đơn hàng của một khách hàng cụ thể dựa trên customerId.
// Endpoint: GET /customers/1/orders
// Ví dụ: /customers/1/orders  -> Trả về danh sách orders của customer có id là 1
// Yêu cầu: Trả về danh sách tất cả đơn hàng của một khách hàng dựa trên customerId. Nếu khách hàng không có đơn hàng nào, trả về danh sách rỗng.
app.get('/customers/:id/orders', (req, res) => {
  const id = req.params.id; //người dùng nhập vào nè //c005
  const customerOrders = orders.filter(order => order.customerId === id); //lấy tất cả các order có customerId trùng với id truyền vào
  res.json(customerOrders); //[]
}); 

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// //4. Lấy thông tin các đơn hàng với tổng giá trị trên 10 triệu
// Viết API để lấy danh sách các đơn hàng có tổng giá trị (totalPrice) trên 10 triệu.
// Endpoint: GET /orders/highvalue
// Yêu cầu: Trả về danh sách các đơn hàng có totalPrice lớn hơn 10 triệu.

app.get('/orders/highvalue', (req, res) => {
  const highValueOrders = orders.filter(order => order.totalPrice >= 100000000); //
  res.json(highValueOrders);
});
