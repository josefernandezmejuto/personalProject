import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
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
export class ArticuloComponent implements OnInit, AfterViewInit {
  listaArticulos: Articulo[] = [];
  articuloForm!: FormGroup;
  editandoId: number | null = null;

  @ViewChild('campoFocus') campoFocusInput!: ElementRef<HTMLInputElement | HTMLSelectElement>;

  constructor(
    private articuloService: ArticuloService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarArticulos();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.campoFocusInput?.nativeElement?.focus(), 100);
  }

  private resetearFormulario(): void {
    this.editandoId = null;
    this.articuloForm.reset({
      precioUnitario: 0,
      precioUrgente: 0,
      stockActual: 100,
      stockMinimo: 5,
      activo: true
    });
    this.campoFocusInput?.nativeElement?.focus();
  }

  inicializarFormulario(): void {
    this.articuloForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-]+$/)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      precioUnitario: [0, [Validators.required, Validators.min(0.01)]],
      precioUrgente: [0, [Validators.required, Validators.min(0.01)]],
      stockActual: [100],
      stockMinimo: [5],
      activo: [true]
    });
  }

  cargarArticulos(): void {
    this.articuloService.getArticulos().subscribe({
      next: (articulos) => {
        this.listaArticulos = articulos;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('❌ Error al cargar inventario:', err)
    });
  }

  guardarArticulo(): void {
    if (this.articuloForm.invalid) {
      alert('Por favor, rellena todos los campos obligatorios o corrige los errores.');
      return;
    }

    const datos: Articulo = this.articuloForm.value;
    const codigoIngresado = datos.codigo.trim().toUpperCase();

    // 🟢 VALIDACIÓN DE CÓDIGO ÚNICO
    const codigoExiste = this.listaArticulos.some((art) => {
      const mismoCodigo = art.codigo.trim().toUpperCase() === codigoIngresado;
      if (this.editandoId !== null) {
        // En edición, se ignora el artículo que se está editando actualmente
        return mismoCodigo && art.id !== this.editandoId;
      }
      return mismoCodigo;
    });

    if (codigoExiste) {
      alert(`El código de artículo "${codigoIngresado}" ya se encuentra registrado. Por favor ingrese uno diferente.`);
      return;
    }

    if (this.editandoId !== null) {
      // Editar / Actualizar (PUT)
      this.articuloService.updateArticulo(this.editandoId, datos).subscribe({
        next: (artActualizado) => {
          console.log('✅ Artículo actualizado:', artActualizado);
          this.cargarArticulos();
          this.resetearFormulario();
        },
        error: (err: any) => console.error('❌ Error al actualizar artículo:', err)
      });
    } else {
      // Crear nuevo (POST)
      this.articuloService.addArticulo(datos).subscribe({
        next: (nuevoArt) => {
          console.log('✅ Artículo guardado en la base de datos:', nuevoArt);
          this.cargarArticulos();
          this.resetearFormulario();
        },
        error: (err: any) => console.error('❌ Error al guardar artículo:', err)
      });
    }
  }

  limpiarFormulario(): void {
    this.resetearFormulario();
  }

  prepararEditar(articulo: Articulo): void {
    this.editandoId = articulo.id!;
    this.articuloForm.patchValue(articulo);
    this.campoFocusInput?.nativeElement?.focus();
  }

  eliminarArticulo(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este artículo?')) {
      this.articuloService.deleteArticulo(id).subscribe({
        next: () => {
          console.log('✅ Artículo eliminado correctamente');
          this.cargarArticulos();
          this.resetearFormulario();
        },
        error: (err: any) => console.error('❌ Error al eliminar artículo:', err)
      });
    }
  }
}
