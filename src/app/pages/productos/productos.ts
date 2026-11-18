
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Productos as ProductoServicio } from '../../services/productos';
import { Producto } from '../../models/producto.models';

@Component({
  selector: 'app-productos',
  imports: [],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {

  productos: Producto[] = [];

  private servicio = inject(ProductoServicio);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.servicio.obtenerProductos().subscribe({
      next: (dato) => {
        this.productos = dato;
        console.log(this.productos);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      }
    });
  }
}
