import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import './printReceipt.css';

const MyOrders = () => {
  const printReceipt = (order) => {
    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Order Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; }
            .receipt { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .order-details { margin-bottom: 20px; padding: 15px 0; border-bottom: 1px solid #eee; }
            .item-list { margin-bottom: 20px; padding: 15px 0; border-bottom: 1px solid #eee; }
            .item-list p { margin: 8px 0; display: flex; justify-content: space-between; }
            .total { text-align: right; font-weight: bold; padding: 15px 0; border-top: 2px solid #eee; }
            .payment-details { padding-top: 15px; }
            .payment-details p { display: flex; justify-content: space-between; margin: 5px 0; }
            .status-paid { color: #2ecc71; display: flex; align-items: center; font-weight: 500; }
            .status-paid::after { content: "✓ Verified"; margin-left: 5px; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1>Big Bite<h1>
              <h2>Order Receipt</h2>
              <p>Order ID: ${order._id}</p>
            </div>
            <div class="order-details">
              <h3>Delivery Address</h3>
              <p>${order.address?.street || 'N/A'}</p>
              <p>${order.address?.city || ''}, ${order.address?.state || ''} ${order.address?.zipCode || ''}</p>
            </div>
            <div class="item-list">
              <h3>Order Items</h3>
              ${order.items.map(item => `
                <p>
                  <span>${item.name} x ${item.quantity}</span>
                  <span>${currency}${(item.price * item.quantity).toFixed(2)}</span>
                </p>
              `).join('')}
            </div>
            <div class="total">
              <p>Total Amount: ${currency}${order.amount.toFixed(2)}</p>
            </div>
            <div class="payment-details">
              <h3>Payment Details</h3>
              <p>
                <span>Payment Status:</span>
                <span class="status-paid"></span>
              </p>
              <p>
                <span>Payment Method:</span>
                <span>${order.paymentMethod || 'Cash On Delivery'}</span>
              </p>
            </div>
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
  };

  
  const [data,setData] =  useState([]);
  const {url,token,currency} = useContext(StoreContext);

  const fetchOrders = async () => {
    const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
    setData(response.data.data)
  }

  useEffect(()=>{
    if (token) {
      fetchOrders();
    }
  },[token])

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order,index)=>{
          return (
            <div key={index} className='my-orders-order'>
                <img src={assets.parcel_icon} alt="" />
                <p>{order.items.map((item,index)=>{
                  if (index === order.items.length-1) {
                    return item.name+" x "+item.quantity
                  }
                  else{
                    return item.name+" x "+item.quantity+", "
                  }
                  
                })}</p>
                <p>{currency}{order.amount}.00</p>
                <p>Items: {order.items.length}</p>
                <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                <button onClick={() => printReceipt(order)}>Print Recipt</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders
