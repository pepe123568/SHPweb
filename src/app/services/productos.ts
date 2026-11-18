
import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, ProductInput } from '../models/producto.models';

@Service()
export class Productos {

  private readonly url = 'https://fakestoreapi.com/products';

  private readonly http = inject(HttpClient);

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }

  // CREAR PRODUCTO
crearProducto(producto: ProductInput){
  return this.http.post<Producto>(this.url, producto);

}

// actualizar producto 
actualizarProducto(id: number, producto: ProductInput){
  return this.http.put<Producto>(`${this.url}/${id}`, producto);

}

// Borrar producto
borrarProducto(id: number){
  return this.http.delete<Producto>(`${this.url}/${id}`);


}

// Obtener categorias
obtenerCategorias(): Observable<string[]> {
  return this.http.get<string[]>(`${this.url}/categories`);
}


}