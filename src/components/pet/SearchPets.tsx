import React, { useState } from 'react';
import { usePets } from '../../context/PetContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import PetCard from './PetCard';
import { Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchPets: React.FC = () => {
  const { searchPets } = usePets();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<'id' | 'name' | 'both'>('both');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const results = searchPets(searchQuery, searchField);
    setSearchResults(results);
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-6 max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Buscar Mascotas</h2>
          
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Ingrese ID o nombre de la mascota..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Consulta de búsqueda"
                  fullWidth
                />
              </div>
              
              <div>
                <Select
                  options={[
                    { value: 'both', label: 'ID o Nombre' },
                    { value: 'id', label: 'Solo ID' },
                    { value: 'name', label: 'Solo Nombre' },
                  ]}
                  value={searchField}
                  onChange={(value) => setSearchField(value as any)}
                  aria-label="Campo de búsqueda"
                  fullWidth
                />
              </div>
              
              <div className="md:col-span-3">
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth
                  disabled={!searchQuery.trim()}
                >
                  <SearchIcon size={18} className="mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-8">
        {searchResults.length > 0 && (
          <>
            <h3 className="text-lg font-medium mb-4">
              Resultados de la búsqueda ({searchResults.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((pet) => (
                <div
                  key={pet.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/mascota/${pet.id}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/mascota/${pet.id}`); }}
                >
                  <PetCard pet={pet} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPets;

