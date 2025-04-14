import React, { useState } from 'react';
import './Manager.css';

function Manager() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
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
                {
                    //TODO add stuff
                }
              </div>
            )}
            {activeModal === 'inventory' && (
              <div className="modal-body">
                <h2>Inventory Management</h2>
                {
                    //TODO add stuff
                }
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