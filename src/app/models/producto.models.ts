
export interface Producto {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}
// Extraccion de las propiedades necesarias para crear un producto 
export type ProductInput = Pick<Producto, 'title' | 'price' | 'description' | 'category' | 'image'>;