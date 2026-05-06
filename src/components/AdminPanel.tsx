import React, { useState } from 'react';
import UploadForm from './UploadForm';
import ProjectList from './ProjectList';

const AdminPanel = () => {
  const [isUploadFormVisible, setUploadFormVisible] = useState(false);

  const toggleUploadForm = () => {
    setUploadFormVisible(!isUploadFormVisible);
  };

  return (
    <div className="admin-panel">
      <h2 className="text-2xl font-bold">Admin Panel</h2>
      <button 
        onClick={toggleUploadForm} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isUploadFormVisible ? 'Hide Upload Form' : 'Show Upload Form'}
      </button>
      
      {isUploadFormVisible && <UploadForm />}
      
      <h3 className="mt-6 text-xl">Project List</h3>
      <ProjectList />
    </div>
  );
};

export default AdminPanel;