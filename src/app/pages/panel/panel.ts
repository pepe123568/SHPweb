
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Productos as ProductoServicio } from '../../services/productos';
import { Producto, ProductInput } from '../../models/producto.models';

@Component({
  selector: 'app-panel',
  imports: [FormsModule],
  templateUrl: './panel.html',
  styleUrl: './panel.css'
})
export class Panel {

  productos = signal<Producto[]>([]);
  categorias = signal<string[]>([]); //Guardar categorias
  editingId = signal<number | null>(null);
  private servicio = inject(ProductoServicio);

  idEdicion: number | null = null;

  formulario = {
    title: '',
    price: 0,
    description: '',
    category: '',
    image: ''
  };

  ngOnInit(): void {
    this.cargarProductos();
    this.servicio.obtenerCategorias().subscribe((data) => this.categorias.set(data));
  }
  

  // Consultar productos
  cargarProductos() {
    this.servicio.obtenerProductos().subscribe({
      next: (datos) => {
        this.productos.set(datos);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
  }

 // Datos del formulario, enlazados con ngModel
  form: ProductInput = { title: '', price: 0, description: '', category: '', image: '' };

   save(): void {

    if (!this.form.title || !this.form.category || !this.form.image || this.form.price <= 0) {
      return;
    }
    const id = this.editingId();
    if (id === null) {
      this.create();
    } else {
      this.update(id);
    }
  }
  // CREATE: agregar un producto
  private create(): void {
    this.servicio.crearProducto(this.form).subscribe({
      next: (productos) => {
        this.productos.update((list) => [productos, ...list]);
        this.cancel();
      },
    });
  }


  // UPDATE: guardar los cambios de un producto
  private update(id: number): void {
    this.servicio.actualizarProducto(id, this.form).subscribe({
      next: (productos) => {
        this.productos.update((list) =>
          list.map((item) => (item.id === id ? { ...item, ...productos } : item))
        );
      },
    });
  }

  // Crear o actualizar producto
  guardarProducto() {

    const datos = { ...this.formulario };

    if (this.idEdicion !== null) {

      const id = this.idEdicion;

      this.servicio.actualizarProducto(id, datos).subscribe({
        next: () => {

          this.productos.update(lista =>
            lista.map(p =>
              p.id === id ? { ...p, ...datos } : p
            )
          );

          alert('Producto actualizado');
          this.cancelarEdicion();
        },
        error: (error) => console.error(error)
      });

    } else {

      this.servicio.crearProducto(datos).subscribe({
        next: (producto) => {

          this.productos.update(lista => [
            producto,
            ...lista
          ]);

          alert('Producto creado');
          this.cancelarEdicion();
        },
        error: (error) => console.error(error)
      });
    }
  }

  // Llena el formulario con el producto que se va a editar
  edit(product: Producto): void {
    this.editingId.set(product.id);
    this.form = { ...product };
  }


  // Limpia el formulario y sale del modo edición
  cancel(): void {
    this.editingId.set(null);
    this.form = { title: '', price: 0, description: '', category: '', image: '' };
  }

  // Seleccionar producto para actualizar
  editarProducto(producto: Producto) {

    this.idEdicion = producto.id;

    this.formulario = {
      title: producto.title,
      price: producto.price,
      description: producto.description,
      category: producto.category,
      image: producto.image
    };
  }

  // Borrar producto
  borrarProducto(id: number) {

    if (!confirm('¿Deseas borrar este producto?')) {
      return;
    }

    this.servicio.borrarProducto(id).subscribe({
      next: () => {

        this.productos.update(lista =>
          lista.filter(producto => producto.id !== id)
        );

        alert('Producto borrado');
      },
      error: (error) => console.error(error)
    });
  }

  cancelarEdicion() {
    this.idEdicion = null;

    this.formulario = {
      title: '',
      price: 0,
      description: '',
      category: '',
      image: ''
    };
  }
}

