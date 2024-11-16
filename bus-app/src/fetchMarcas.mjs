// Importar la librería de fetch en Node.js
import fetch from 'node-fetch';

fetch('http://localhost:8080/api/v1/marcas')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log('Marcas cargadas:', data);
  })
  .catch((error) => console.error('Error al cargar marcas:', error));
