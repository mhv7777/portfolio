import React, { useState } from 'react';
import Header from '../components/Header';
import ProjectList from '../components/ProjectList';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div>
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedRole={selectedRole}
        onSelectRole={setSelectedRole}
      />
      <main className="container mx-auto px-8">
        <ProjectList selectedCategory={selectedCategory} selectedRole={selectedRole} />
      </main>
    </div>
  );
};

export default Home;