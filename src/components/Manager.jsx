import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Manager.css';

function Manager() {
  const [activeModal, setActiveModal] = useState(null);
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [newIngredient, setNewIngredient] = useState({ item: '', quantity: '' });

  useEffect(() => {
    axios.get('https://leboba.onrender.com/api/orders/getOrder')
      .then(res => {
        setOrders(res.data.orders);
        const total = res.data.orders.reduce((sum, order) => sum + Number(order.totalprice), 0);
        setTotalSales(total);
      })
      .catch(err => console.error('Failed to load orders:', err));
  }, []);

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    try {
      // First check if ingredient exists
      const response = await axios.get(`https://leboba.onrender.com/api/ingredients`);
      const existingIngredient = response.data.find(
        ing => ing.item.toLowerCase() === newIngredient.item.toLowerCase()
      );

      if (existingIngredient) {
        const newQuantity = Number(existingIngredient.quantity) + Number(newIngredient.quantity);
        await axios.put(`https://leboba.onrender.com/api/ingredients/${existingIngredient.idinventory}`, {
          item: existingIngredient.item,
          quantity: newQuantity
        });
      } else {
        await axios.post('https://leboba.onrender.com/api/ingredients', newIngredient);
      }
      
      setNewIngredient({ item: '', quantity: '' });
      alert('Inventory updated successfully!');
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert('Failed to update inventory');
    }
  };

  return (
    <div className="manager-page">
      <h1>Manager Dashboard</h1>
      <div className="manager-content">
        <section className="manager-section clickable" onClick={() => openModal('sales')}>
          <h2>Sales Reports</h2>
          <div className="reports-container">
            <p>Click to view sales reports</p>
          </div>
        </section>
        
        <section className="manager-section clickable" onClick={() => openModal('inventory')}>
          <h2>Inventory Management</h2>
          <div className="inventory-container">
            <p>Click to manage inventory</p>
          </div>
        </section>

        <section className="manager-section clickable" onClick={() => openModal('employee')}>
          <h2>Employee Management</h2>
          <div className="inventory-container">
            <p>Click to manage employees</p>
          </div>
        </section>
      </div>

      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>&times;</button>
            {activeModal === 'sales' && (
              <div className="modal-body">
                <h2>Sales Reports</h2>
                <div className="sales-summary">
                  <h3>Last 24 Hours</h3>
                  <p>Total Sales: ${totalSales}</p>
                  <p>Number of Orders: {orders.length}</p>
                </div>
                <div className="orders-list">
                  <h3>Recent Orders</h3>
                  {orders.map(order => (
                    <div key={order.idorder} className="order-item">
                      <p>Order #{order.idorder}</p>
                      <p>Amount: ${order.totalprice.toFixed(2)}</p>
                      <p>Time: {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeModal === 'inventory' && (
              <div className="modal-body">
                <h2>Inventory Management</h2>
                <form onSubmit={handleInventorySubmit} className="inventory-form">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={newIngredient.item}
                    onChange={(e) => setNewIngredient({ ...newIngredient, item: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                    required
                  />
                  <button type="submit" className="add-btn">Add to Inventory</button>
                </form>
              </div>
            )}
            {activeModal === 'employee' && (
              <div className="modal-body">
                <h2>Employee Management</h2>
                {
                    //TODO add stuff
                }
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Manager;