import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Manager.css';
import { drinkRecipes } from '../utils/recipes';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Manager() {
  // ======= STATE VARIABLES =======
  const [activeModal, setActiveModal] = useState(null);

  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [hourlySales, setHourlySales] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [inventoryUsage, setInventoryUsage] = useState({});

  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '' });

  const [newIngredient, setNewIngredient] = useState({ item: '', quantity: '', type: '' });
  const [allInventory, setAllInventory] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);

  const [menuItems, setMenuItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({ item: '', price: '' });

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

  const calculateInventoryUsage = (orders) => {
    const usage = {};
    
    // Menu ID to name mapping
    const menuMap = {
      1: "Classic Milk Tea",
      2: "Coconut Milk Tea", 
      3: "Almond Milk Tea",
      4: "Matcha Milk Tea",
      5: "Mango and Passion Fruit Tea",
      6: "Mango Green Tea",
      7: "Kiwi Fruit Tea",
      8: "Tropical Fruit Tea",
      9: "Tapioca Pearls",
      10: "Lychee Jelly",
      11: "Rainbow Jelly",
      12: "Coffee Jelly",
      13: "Strawberry Popping Boba",
      14: "Mango Popping Boba",
      15: "Lychee Popping Boba",
      16: "Red Bean Ice Cream",
      17: "Nutella Kaiyaki",
      18: "Crispy Puffs",
      19: "Dumplings",
      33: "Seasonal Tigers Blood Lemonade"
    };

    orders.forEach(order => {
      // Process each menu item in the order
      order.idmenu.forEach(menuId => {
        // Skip ice/sugar options
        if (menuId >= 34 && menuId <= 39) return;
        
        const itemName = menuMap[menuId];
        if (!itemName) return;

        const recipe = drinkRecipes[itemName];
        if (recipe) {
          Object.entries(recipe).forEach(([ingredient, amount]) => {
            usage[ingredient] = (usage[ingredient] || 0) + amount;
          });
        }
      });
    });

    return usage;
  };

  // ======= DATA FETCHING =======
  useEffect(() => {
    fetchOrders();
    fetchIngredients();
    fetchInventory();
    if (activeModal === 'menu') {
      fetchMenuItems();
    }
  }, [activeModal]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://leboba.onrender.com/api/orders/getOrder');
      
      // Filter orders based on date range
      const filteredOrders = res.data.orders.filter(order => {
        // Parse ISO timestamp
        const orderDate = new Date(order.created_at);
        // Create start date at beginning of day (00:00:00)
        const startDate = new Date(dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        // Create end date at end of day (23:59:59.999)
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        
        return orderDate >= startDate && orderDate <= endDate;
      });

      setOrders(filteredOrders);
      const total = filteredOrders.reduce((sum, order) => sum + Number(order.totalprice), 0);
      setTotalSales(total);
      setHourlySales(processHourlySales(filteredOrders));
      setInventoryUsage(calculateInventoryUsage(filteredOrders));
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

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get('https://leboba.onrender.com/api/menu/items');
      setMenuItems(res.data);
    } catch (err) {
      console.error('Failed to load menu items:', err);
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
      alert('Employee deleted successfully!');
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
    const amount = Number(e.target.amount.value);
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
      fetchInventory();
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
      fetchIngredients();
      alert('Ingredient deleted!');
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      alert('Failed to delete ingredient');
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const existingItem = menuItems.find(item => item.item.toLowerCase() === newMenuItem.item.toLowerCase());
  
      if (existingItem) {
        // If item exists, update both item name and price
        await axios.put(`https://leboba.onrender.com/api/menu/${existingItem.idmenu}`, {
          item: existingItem.item, // must send the item name too!
          price: parseFloat(newMenuItem.price)
        });
        alert('Menu item price updated successfully!');
      } else {
        // If item doesn't exist, add new one
        await axios.post('https://leboba.onrender.com/api/menu/add', {
          item: newMenuItem.item,
          price: parseFloat(newMenuItem.price)
        });
        alert('New menu item added successfully!');
      }
  
      setNewMenuItem({ item: '', price: '' });
      fetchMenuItems();
    } catch (err) {
      console.error('Error adding/updating menu item:', err);
      alert('Failed to add or update menu item');
    }
  };
  
  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await axios.delete(`https://leboba.onrender.com/api/menu/items/${id}`);
      fetchMenuItems();
      alert('Menu item deleted successfully!');
    } catch (err) {
      console.error('Error deleting menu item:', err);
      alert('Failed to delete menu item');
    }
  };

  // ======= UI / RENDER =======
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.idemployee.toString().includes(searchQuery)
  );

  useEffect(() => {
    if (activeModal === 'sales') {
      console.log('Current orders:', orders);
      console.log('Calculated usage:', inventoryUsage);
    }
  }, [orders, inventoryUsage, activeModal]);

  return (
    <div className="manager-page">
      <h1>Manager Dashboard</h1>

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

      {/* Modal Content */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>&times;</button>

            {activeModal === 'sales' && (
              <div className="modal-body">
                <h2>Sales Reports</h2>
                
                {/* Add date range picker */}
                <div className="date-range-picker">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
                  />
                  <button onClick={fetchOrders}>Update Report</button>
                </div>

                <div className="inventory-usage">
                  <h3>Inventory Usage Report</h3>
                  <div className="chart-container">
                    <Line
                      data={{
                        labels: Object.keys(inventoryUsage),
                        datasets: [{
                          label: 'Units Used',
                          data: Object.values(inventoryUsage),
                          borderColor: 'rgb(75, 192, 192)',
                          backgroundColor: 'rgba(75, 192, 192, 0.5)',
                          tension: 0.1
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Inventory Usage by Item'
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Units Used'
                            }
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Ingredients'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  
                  {/* Add a tabular view as well */}
                  <div className="usage-table">
                    <h4>Detailed Usage Report</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Ingredient</th>
                          <th>Units Used</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(inventoryUsage).map(([ingredient, amount]) => (
                          <tr key={ingredient}>
                            <td>{ingredient}</td>
                            <td>{amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="sales-summary">
                  <h3>Last 24 Hours</h3>
                  <p>Total Sales: ${totalSales.toFixed(2)}</p>
                  <p>Number of Orders: {orders.length}</p>
                </div>
                <div className="hourly-sales">
                  <h3>Sales by Hour(X-report)</h3>
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

                {/* Inventory Items */}
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

                {/* Ingredient Items */}
                <h3>Ingredients</h3>
                {allIngredients.map(item => (
                  <div key={item.idingredient} className="item-card">
                    <p><strong>{item.item}</strong> — {item.quantity} units</p>
                    <form onSubmit={(e) => handleAddIngredientQuantity(e, item.idingredient)}>
                      <input type="number" name="amount" placeholder="Amount to add" required className="quantity-input" />
                      <button type="submit" className="add-btn">Add Quantity</button>
                    </form>
                    <button className="delete-btn" onClick={() => handleDeleteIngredientItem(item.idingredient)}>Delete Item</button>
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
                <form onSubmit={handleAddEmployee} className="inventory-form">
                  <input type="text" placeholder="Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} required />
                  <input type="text" placeholder="Role" value={newEmployee.role} onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })} required />
                  <button type="submit" className="add-btn">Add Employee</button>
                </form>
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
                <h3>Current Menu Items</h3>
                {menuItems.map(menuItem => (
                  <div key={menuItem.idmenu} className="item-card">
                    <p><strong>{menuItem.item}</strong> — ${Number(menuItem.price).toFixed(2)}</p>
                    <button className="delete-btn" onClick={() => handleDeleteMenuItem(menuItem.idmenu)}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Manager;
