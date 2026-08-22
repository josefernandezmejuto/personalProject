import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Articulo } from '../../models/articulo.model';
import { ArticuloService } from '../../services/articulo.service';

@Component({
  selector: 'app-articulo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './articulo.html',
  styleUrl: './articulo.css'
})
export class ArticuloComponent implements OnInit {
  listaArticulos: Articulo[] = [];
  articuloForm!: FormGroup;
  editandoId: number | null = null;

  categorias: string[] = ['Ropa superior', 'Ropa inferior', 'Vestidos y prendas completas', 'Ropa interior y de dormir', 'Ropa infantil', 'Prendas especiales', 'Dormitorio', 'Baño', 'Cocina y comedor', 'Salón y decoración', 'Accesorios', 'Calzado'];

  constructor(
    private articuloService: ArticuloService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarArticulos();
  }

  inicializarFormulario(): void {
    this.articuloForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-]+$/)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['', [Validators.required]],
      precioUnitario: [0, [Validators.required, Validators.min(0.01)]],
      precioUrgente: [0, [Validators.required, Validators.min(0.01)]],
      stockActual: [0], // Sin validadores requeridos en interfaz
      stockMinimo: [0],   // Sin validadores requeridos en interfaz
      activo: [true]
    });
  }

  cargarArticulos(): void {
    this.articuloService.getArticulos().subscribe({
      next: (articulos) => {
        this.listaArticulos = articulos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ Error al cargar inventario:', err)
    });
  }

  guardarArticulo(): void {
    if (this.articuloForm.invalid) {
      alert('Por favor, rellena todos los campos obligatorios o corrige los errores.');
      return;
    }

    const datos: Articulo = this.articuloForm.value;

    if (this.editandoId !== null) {
      // Editar / Actualizar (PUT)
      this.articuloService.updateArticulo(this.editandoId, datos).subscribe({
        next: (artActualizado) => {
          console.log('✅ Artículo actualizado:', artActualizado);
          this.cargarArticulos();
          this.limpiarFormulario();
        },
        error: (err) => console.error('❌ Error al actualizar artículo:', err)
      });
    } else {
      // Crear nuevo (POST)
      this.articuloService.addArticulo(datos).subscribe({
        next: (nuevoArt) => {
          console.log('✅ Artículo guardado en la base de datos:', nuevoArt);
          this.cargarArticulos();
          this.limpiarFormulario();
        },
        error: (err) => console.error('❌ Error al guardar artículo:', err)
      });
    }
  }

  limpiarFormulario(): void {
    this.editandoId = null;
    this.articuloForm.reset();
    this.articuloForm.patchValue({
      precioUnitario: 0,
      precioUrgente: 0,
      stockActual: 100,
      stockMinimo: 5,
      activo: true
    });
  }

  prepararEditar(articulo: Articulo): void {
    this.editandoId = articulo.id!;
    this.articuloForm.patchValue(articulo);
  }

  eliminarArticulo(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este artículo?')) {
      this.articuloService.deleteArticulo(id).subscribe({
        next: () => {
          console.log('✅ Artículo eliminado correctamente');
          this.cargarArticulos();
        },
        error: (err) => console.error('❌ Error al eliminar artículo:', err)
      });
    }
  }
}
