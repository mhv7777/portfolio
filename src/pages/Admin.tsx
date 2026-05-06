import React from 'react';
import AdminPanel from '../components/AdminPanel';

const Admin = () => {
  return (
    <div className="admin-page">
      <h1 className="text-3xl font-serif text-center text-white">Admin Dashboard</h1>
      <AdminPanel />
    </div>
  );
};

export default Admin;