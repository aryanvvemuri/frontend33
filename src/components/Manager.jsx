import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Manager.css';

function Manager() {
  // Modals and dashboard states
  const [activeModal, setActiveModal] = useState(null);
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [newIngredient, setNewIngredient] = useState({ item: '', quantity: '' });

  // Employee management states
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // Sales analysis
  const [hourlySales, setHourlySales] = useState([]);

  // Helper to process sales data into hourly chunks
  const processHourlySales = (orders) => {
    const hourlyData = {};
    
    orders.forEach(order => {
      const orderHour = new Date(order.created_at).getHours();
      if (!hourlyData[orderHour]) {
        hourlyData[orderHour] = { total: 0, count: 0 };
      }
      hourlyData[orderHour].total += Number(order.totalprice);
      hourlyData[orderHour].count += 1;
    });

    // Convert to sorted array for display
    return Object.entries(hourlyData)
      .map(([hour, data]) => ({
        hour: hour,
        total: data.total,
        count: data.count
      }))
      .sort((a, b) => a.hour - b.hour);
  };

  // Fetch orders when the page first loads
  useEffect(() => {
    axios.get('https://leboba.onrender.com/api/orders/getOrder')
      .then(res => {
        setOrders(res.data.orders);
        const total = res.data.orders.reduce((sum, order) => sum + Number(order.totalprice), 0);
        setTotalSales(total);
        setHourlySales(processHourlySales(res.data.orders));
      })
      .catch(err => console.error('Failed to load orders:', err));
  }, []);

  // Open specific modal
  const openModal = (modalType) => {
    setActiveModal(modalType);
    if (modalType === 'employee') {
      fetchEmployees(); // Only fetch employees when needed
    }
  };

  // Close the modal
  const closeModal = () => {
    setActiveModal(null);
  };

  // Fetch employee list from backend
  const fetchEmployees = async () => {
    try {
      const res = await axios.get('https://leboba.onrender.com/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };
  
  // Filter employees based on search query
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.idemployee.toString().includes(searchQuery)
  );
  
  // Add a new employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://leboba.onrender.com/api/employees', {
        name: newEmployee.name,
        title: newEmployee.role,
      });
      setNewEmployee({ name: '', role: '' });
      fetchEmployees(); // Refresh employee list after adding
      alert('Employee added!');
    } catch (err) {
      console.error('Error adding employee:', err);
      alert('Failed to add employee');
    }
  };  
  
  // Delete an employee
  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
  
    try {
      await axios.delete(`https://leboba.onrender.com/api/employees/${id}`);
      fetchEmployees(); // Refresh employee list after deleting
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert('Failed to delete employee');
    }
  };  

  // Add or update inventory
  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://leboba.onrender.com/api/ingredients`);
      const existingIngredient = response.data.find(
        ing => ing.item.toLowerCase() === newIngredient.item.toLowerCase()
      );

      if (existingIngredient) {
        // Update quantity if ingredient exists
        const newQuantity = Number(existingIngredient.quantity) + Number(newIngredient.quantity);
        await axios.put(`https://leboba.onrender.com/api/ingredients/${existingIngredient.idinventory}`, {
          item: existingIngredient.item,
          quantity: newQuantity
        });
      } else {
        // Otherwise create a new ingredient
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
        {/* Manager options: sales, inventory, employee */}
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

      {/* Modals appear based on activeModal */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>&times;</button>
            
            {/* Sales modal */}
            {activeModal === 'sales' && (
              <div className="modal-body">
                <h2>Sales Reports</h2>
                <div className="sales-summary">
                  <h3>Last 24 Hours</h3>
                  <p>Total Sales: ${totalSales.toFixed(2)}</p>
                  <p>Number of Orders: {orders.length}</p>
                </div>
                
                <div className="hourly-sales">
                  <h3>Sales by Hour</h3>
                  <div className="hourly-sales-grid">
                    {hourlySales.map(({ hour, total, count }) => (
                      <div key={hour} className="hourly-item">
                        <h4>{hour}:00</h4>
                        <p>Sales: ${total.toFixed(2)}</p>
                        <p>Orders: {count}</p>
                      </div>
                    ))}
                  </div>
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

            {/* Inventory modal */}
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

            {/* Employee modal */}
            {activeModal === 'employee' && (
              <div className="modal-body">
                <h2>Employee Management</h2>

                {/* Add employee form */}
                <form onSubmit={handleAddEmployee} className="inventory-form">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Manager, Employee)"
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    required
                  />
                  <button type="submit" className="add-btn">Add Employee</button>
                </form>

                {/* List current employees */}
                <div className="employee-list">
                  <h3>Current Employees</h3>
                  {filteredEmployees.length === 0 ? (
                    <p style={{ color: "#444" }}>No employees found.</p>
                  ) : (
                    filteredEmployees.map(emp => (
                      <div key={emp.idemployee} className="employee-card">
                        <p><strong>ID:</strong> {emp.idemployee}</p>
                        <p><strong>Name:</strong> {emp.name}</p>
                        <p><strong>Role:</strong> {emp.title}</p>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteEmployee(emp.idemployee)}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default Manager;
