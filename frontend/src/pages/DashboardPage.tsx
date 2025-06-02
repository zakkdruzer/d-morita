import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import SearchPets from '../components/pet/SearchPets';
import AddPetForm from '../components/pet/AddPetForm';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'add'>('search');

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'search' ? <SearchPets /> : <AddPetForm />}
    </MainLayout>
  );
};

export default DashboardPage;