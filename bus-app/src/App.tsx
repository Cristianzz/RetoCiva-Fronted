import React, { useState, useEffect } from 'react';
import { Bus } from './type';

const App: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [newBus, setNewBus] = useState<Partial<Bus>>({});
  const [editBus, setEditBus] = useState<Bus | null>(null);
  const [marcas, setMarcas] = useState<{ marcaId: number, nombre: string }[]>([]);
  
  

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/buses')
      .then(response => response.json())
      .then(data => setBuses(data))
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/marcas')
      .then(response => response.json())
      .then(data => {
        console.log(typeof data, data); 
        setMarcas(data);
      })
      .catch(error => console.error('Error:', error));
  }, []);
  

  const handleCreate = () => {
    fetch('http://localhost:8080/api/v1/buses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBus),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Error al crear el bus: ${text}`);
          });
        }
        return response.json();
      })
      .then(bus => {
        setBuses([...buses, bus]);
        setNewBus({});
      })
      .catch(error => console.error('Error:', error));
  };
  
  
  


  const handleDelete = (id: number) => {
    fetch(`http://localhost:8080/api/v1/buses/${id}`, { method: 'DELETE' })
      .then(() => {
        setBuses(buses.filter(bus => bus.busId !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  const handleUpdate = () => {
    if (!editBus) return;

    fetch(`http://localhost:8080/api/v1/buses/${editBus.busId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editBus),
    })
      .then(response => response.json())
      .then(updatedBus => {
        setBuses(
          buses.map(bus => (bus.busId === updatedBus.busId ? updatedBus : bus))
        );
        setEditBus(null);
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">CRUD de Buses</h1>

      <div className="mb-4">
        <h3>Agregar Bus</h3>
        <input
          placeholder="Número de Bus"
          value={newBus.numeroBus || ''}
          onChange={e => setNewBus({ ...newBus, numeroBus: e.target.value })}
        />
        <input
          placeholder="Placa"
          value={newBus.placa || ''}
          onChange={e => setNewBus({ ...newBus, placa: e.target.value })}
        />
        <input
          placeholder="Características"
          value={newBus.caracteristicas || ''}
          onChange={e =>
          setNewBus({ ...newBus, caracteristicas: e.target.value })
        }
        />
        <input
          type="checkbox"
          checked={newBus.activo || false}
          onChange={e =>
          setNewBus({ ...newBus, activo: e.target.checked })
        }
        />
        
        <select
  value={newBus.marca?.marcaId || ''} 
  onChange={e => {
    const selectedMarcaId = parseInt(e.target.value);
    const selectedMarca = marcas.find(marca => marca.marcaId === selectedMarcaId);
    
    if (selectedMarca) {
      setNewBus({
        ...newBus,
        marca: selectedMarca,
      });
    }
  }}
>
  <option value="">Seleccione una marca</option>
  {marcas.map(marca => (
    <option key={marca.marcaId} value={marca.marcaId}>
      {marca.nombre}
    </option>
  ))}
</select>
       
        <button onClick={handleCreate}>Agregar</button>
      </div>

   
      <table className="table table-striped table-bordered mt-4">
        <thead className="thead-dark">
          <tr>
            <th>Número de Bus</th>
            <th>Placa</th>
            <th>Marca</th>
            <th>Características</th>
            <th>Activo</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
           {buses.map(bus => (
            <tr key={bus.busId}> 
            <td>{bus.numeroBus}</td>
            <td>{bus.placa}</td>
            <td>{bus.marca?.nombre || 'N/A'}</td>
            <td>{bus.caracteristicas}</td>
            <td>{bus.activo ? 'Sí' : 'No'}</td>
            <td>{new Date(bus.fechaCreacion).toLocaleDateString()}</td>
          <td>
            <button onClick={() => setEditBus(bus)}>Editar</button>
            <button onClick={() => handleDelete(bus.busId)}>Eliminar</button>
         </td>
        </tr>
        ))} 
      </tbody>

      </table>

      {editBus && (
        <div>
          <h3>Editar Bus</h3>
          <input
            placeholder="Número de Bus"
            value={editBus.numeroBus || ''}
            onChange={e =>
              setEditBus({ ...editBus, numeroBus: e.target.value })
            }
          />
          <input
            placeholder="Placa"
            value={editBus.placa || ''}
            onChange={e => setEditBus({ ...editBus, placa: e.target.value })}
          />
          <button onClick={handleUpdate}>Guardar</button>
          <button onClick={() => setEditBus(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default App;




