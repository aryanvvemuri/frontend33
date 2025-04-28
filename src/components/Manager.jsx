import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Manager.css';

function Manager() {

  // ======= STATE VARIABLES =======
  const [activeModal, setActiveModal] = useState(null);
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [hourlySales, setHourlySales] = useState([]);
  
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '' });
  
  const [newIngredient, setNewIngredient] = useState({ item: '', quantity: '' });
  const [allInventory, setAllInventory] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  
  const [newMenuItem, setNewMenuItem] = useState({ item: '', price: '' });
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState([]);

  // ======= UTILITY FUNCTIONS =======

  const processHourlySales = (orders) => {
    const hourlyData = {};
    orders.forEach(order => {
      const hour = new Date(order.created_at).getHours();
      if (!hourlyData[hour]) {
        hourlyData[hour] = { total: 0, count: 0 };
      }
      hourlyData[hour].total += Number(order.totalprice);
      hourlyData[hour].count += 1;
    });
    return Object.entries(hourlyData)
      .map(([hour, data]) => ({ hour, total: data.total, count: data.count }))
      .sort((a, b) => a.hour - b.hour);
  };

  // ======= DATA FETCHING =======

  useEffect(() => {
    fetchOrders();
    fetchIngredients();
    fetchInventory();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://leboba.onrender.com/api/orders/getOrder');
      setOrders(res.data.orders);
      const total = res.data.orders.reduce((sum, order) => sum + Number(order.totalprice), 0);
      setTotalSales(total);
      setHourlySales(processHourlySales(res.data.orders));
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('https://leboba.onrender.com/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to load employees:', err);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await axios.get('https://leboba.onrender.com/api/inventory');
      setAllInventory(res.data);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    }
  };

  const fetchIngredients = async () => {
    try {
      const res = await axios.get('https://leboba.onrender.com/api/ingredients');
      setAllIngredients(res.data);
    } catch (err) {
      console.error('Failed to load ingredients:', err);
    }
  };

  // ======= HANDLER FUNCTIONS =======

  const openModal = (modalType) => {
    setActiveModal(modalType);
    if (modalType === 'employee') {
      fetchEmployees();
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://leboba.onrender.com/api/employees', {
        name: newEmployee.name,
        title: newEmployee.role
      });
      setNewEmployee({ name: '', role: '' });
      fetchEmployees();
      alert('Employee added!');
    } catch (err) {
      console.error('Error adding employee:', err);
      alert('Failed to add employee');
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`https://leboba.onrender.com/api/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert('Failed to delete employee');
    }
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (newIngredient.type === 'inventory') {
        await axios.post('https://leboba.onrender.com/api/inventory', {
          item: newIngredient.item,
          quantity: newIngredient.quantity
        });
        fetchInventory();
      } else if (newIngredient.type === 'ingredient') {
        await axios.post('https://leboba.onrender.com/api/ingredients', {
          item: newIngredient.item,
          quantity: newIngredient.quantity
        });
        fetchIngredients();
      } else {
        alert('Please select a type (Inventory or Ingredient)');
        return;
      }
  
      setNewIngredient({ item: '', quantity: '', type: '' });
      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    }
  };
  

  const handleAddInventoryQuantity = async (e, id) => {
    e.preventDefault();
    e.stopPropagation() // so it doesnt double use yk
    const amount = Number(e.target.amount.value);
    console.log("INVENTORY ID:", id, "AMOUNT:", amount); // <--- ADD THIS
    if (isNaN(amount)) return alert('Invalid amount');
    try {
      await axios.patch(`https://leboba.onrender.com/api/inventory/${id}/add`, { amount });
      fetchInventory();
      alert('Inventory quantity updated!');
    } catch (error) {
      console.error('Error updating inventory quantity:', error);
      alert('Failed to update quantity');
    }
  };
  

  const handleAddIngredientQuantity = async (e, id) => {
    e.preventDefault();
    e.stopPropagation()
    const amount = Number(e.target.amount.value);
    if (isNaN(amount)) return alert('Invalid amount');
    try {
      await axios.patch(`https://leboba.onrender.com/api/ingredients/${id}/add`, { amount });
      fetchIngredients();
      alert('Ingredient quantity updated!');
    } catch (err) {
      console.error('Error updating ingredient quantity:', err);
      alert('Failed to update quantity');
    }
  };
  const handleDeleteInventoryItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?')) return;
  
    try {
      await axios.delete(`https://leboba.onrender.com/api/inventory/${id}`);
      fetchInventory(); // Refresh inventory
      alert('Inventory item deleted!');
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      alert('Failed to delete inventory item');
    }
  };
  
  const handleDeleteIngredientItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ingredient?')) return;
  
    try {
      await axios.delete(`https://leboba.onrender.com/api/ingredients/${id}`);
      fetchIngredients(); // Refresh ingredients
      alert('Ingredient deleted!');
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      alert('Failed to delete ingredient');
    }
  };
  
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://leboba.onrender.com/api/menu/add', {
        item: newMenuItem.item,
        price: newMenuItem.price
      });
      const newItemId = res.data.idmenu;
      for (const ingredientId of selectedIngredients) {
        await axios.post('https://leboba.onrender.com/api/associations/menu-ingredients', {
          idmenu: newItemId,
          idingredient: ingredientId
        });
      }
      for (const inventoryId of selectedInventory) {
        await axios.post('https://leboba.onrender.com/api/associations/menu-inventory', {
          idmenu: newItemId,
          idinventory: inventoryId
        });
      }
      setNewMenuItem({ item: '', price: '' });
      setSelectedIngredients([]);
      setSelectedInventory([]);
      alert('Menu item added successfully!');
    } catch (err) {
      console.error('Error adding menu item:', err);
      alert('Failed to add menu item');
    }
  };

  // ======= UI / RENDER =======

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.idemployee.toString().includes(searchQuery)
  );

  return (
    <div className="manager-page">
      <h1>Manager Dashboard</h1>

      {/* Main sections */}
      <div className="manager-content">
        <section className="manager-section clickable" onClick={() => openModal('sales')}>
          <h2>Sales Reports</h2>
          <p>Click to view sales reports</p>
        </section>
        <section className="manager-section clickable" onClick={() => openModal('inventory')}>
          <h2>Inventory Management</h2>
          <p>Click to manage inventory</p>
        </section>
        <section className="manager-section clickable" onClick={() => openModal('employee')}>
          <h2>Employee Management</h2>
          <p>Click to manage employees</p>
        </section>
        <section className="manager-section clickable" onClick={() => openModal('menu')}>
          <h2>Menu Management</h2>
          <p>Click to manage menu</p>
        </section>
      </div>

      {/* Modal overlays */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>&times;</button>

            {/* Modals */}
            {activeModal === 'sales' && (
              <div className="modal-body">
                <h2>Sales Reports</h2>

                {/* Sales Summary */}
                <div className="sales-summary">
                  <h3>Last 24 Hours</h3>
                  <p>Total Sales: ${totalSales.toFixed(2)}</p>
                  <p>Number of Orders: {orders.length}</p>
                </div>

                {/* Sales by Hour */}
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

                {/* Recent Orders */}
                <div className="orders-list">
                  <h3>Recent Orders</h3>
                  {orders.map(order => (
                    <div key={order.idorder} className="order-item">
                      <p>Order #{order.idorder}</p>
                      <p>Amount: ${Number(order.totalprice).toFixed(2)}</p>
                      <p>Time: {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {activeModal === 'inventory' && (
              <div className="modal-body">
                <h2>Inventory Management</h2>

                {/* Add New Inventory Form */}
                <form onSubmit={handleInventorySubmit} className="inventory-form">
                <select
                  value={newIngredient.type}
                  onChange={(e) => setNewIngredient({ ...newIngredient, type: e.target.value })}
                  required
                  className="inventory-type-select"
                >
                  <option value="">Select Type</option>
                  <option value="inventory">Inventory</option>
                  <option value="ingredient">Ingredient</option>
                </select>
                  <input type="text" placeholder="Item name" value={newIngredient.item} onChange={(e) => setNewIngredient({ ...newIngredient, item: e.target.value })} required />
                  <input type="number" placeholder="Quantity" value={newIngredient.quantity} onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })} required />
                  <button type="submit" className="add-btn">Add New</button>
                </form>

                {/* Inventory List */}
                <h3>Inventory Items</h3>
                {allInventory.map(item => (
                  <div key={item.idinventory} className="item-card">
                    <p><strong>{item.item}</strong> — {item.quantity} units</p>
                    <form onSubmit={(e) => handleAddInventoryQuantity(e, item.idinventory)}>
                    <input type="number" name="amount" placeholder="Amount to add" required className="quantity-input" />
                    <button type="submit" className="add-btn">Add Quantity</button>
                  </form>
                  <button className="delete-btn" onClick={() => handleDeleteInventoryItem(item.idinventory)}>Delete Item</button>
                  </div>
                ))}

                {/* Ingredient List */}
                <h3>Ingredients</h3>
                {allIngredients.map(item => (
                  <div key={item.idinventory || item.idingredient} className="item-card">
                    <p><strong>{item.item}</strong> — {item.quantity} units</p>
                    <form onSubmit={(e) => handleAddIngredientQuantity(e, item.idinventory || item.idingredient)}>
                    <input type="number" name="amount" placeholder="Amount to add" required className="quantity-input" />
                    <button type="submit" className="add-btn">Add Quantity</button>
                  </form>
                  <button className="delete-btn" onClick={() => handleDeleteIngredientItem(item.idinventory || item.idingredient)}>Delete Item</button>
                  </div>
                ))}
              </div>
            )}

            {activeModal === 'employee' && (
              <div className="modal-body">
                <h2>Employee Management</h2>
                <input type="text" placeholder="Search employees..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="inventory-form" />
                {filteredEmployees.map(emp => (
                  <div key={emp.idemployee} className="employee-card">
                    <p><strong>ID:</strong> {emp.idemployee}</p>
                    <p><strong>Name:</strong> {emp.name}</p>
                    <p><strong>Role:</strong> {emp.title}</p>
                    <button className="delete-btn" onClick={() => handleDeleteEmployee(emp.idemployee)}>Delete</button>
                  </div>
                ))}
              </div>
            )}

            {activeModal === 'menu' && (
              <div className="modal-body">
                <h2>Menu Management</h2>
                <form onSubmit={handleAddMenuItem} className="inventory-form">
                  <input type="text" placeholder="Menu Item Name" value={newMenuItem.item} onChange={(e) => setNewMenuItem({ ...newMenuItem, item: e.target.value })} required />
                  <input type="number" placeholder="Price" value={newMenuItem.price} onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })} required />
                  <button type="submit" className="add-btn">Add Menu Item</button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default Manager;
