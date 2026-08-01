import { Component, OnInit } from '@angular/core';
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

  categorias: string[] = ['Electrónica', 'Periféricos', 'Pantallas', 'Oficina', 'Repuestos', 'Otros'];

  constructor(
    private articuloService: ArticuloService,
    private fb: FormBuilder
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
      descuento: [0, [Validators.min(0), Validators.max(100)]],
      stockActual: [0, [Validators.required, Validators.min(0)]],
      stockMinimo: [0, [Validators.required, Validators.min(0)]],
      activo: [true]
    });
  }

  cargarArticulos(): void {
    this.listaArticulos = this.articuloService.getArticulos();
  }

  guardarArticulo(): void {
    if (this.articuloForm.invalid) {
      alert('Por favor, rellena todos los campos obligatorios o corrige los errores.');
      return;
    }

    const datos = this.articuloForm.value;

    if (this.editandoId !== null) {
      this.articuloService.updateArticulo(this.editandoId, datos);
      this.editandoId = null;
    } else {
      this.articuloService.addArticulo(datos);
    }

    this.cargarArticulos();
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.editandoId = null;
    this.articuloForm.reset();
    this.articuloForm.patchValue({
      precioUnitario: 0,
      descuento: 0,
      stockActual: 0,
      stockMinimo: 0,
      activo: true
    });
  }

  prepararEditar(articulo: Articulo): void {
    this.editandoId = articulo.id!;
    this.articuloForm.patchValue(articulo);
  }

  eliminarArticulo(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este artículo?')) {
      this.articuloService.deleteArticulo(id);
      this.cargarArticulos();
    }
  }
}
