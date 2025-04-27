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
