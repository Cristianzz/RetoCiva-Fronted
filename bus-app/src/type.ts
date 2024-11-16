export interface Marca {
  marcaId: number;
  nombre: string; 
}

export interface Bus {
  busId: number;
  numeroBus: string;
  placa: string;
  caracteristicas: string;
  activo: boolean;
  fechaCreacion: string;
  marca:Marca;
}



