import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Factura, DetalleFactura } from '../../models/factura.model';
import { Persona } from '../../models/persona.model';
import { Articulo } from '../../models/articulo.model';

import { FacturaService } from '../../services/factura.service';
import { PersonaService } from '../../services/persona.service';
import { ArticuloService } from '../../services/articulo.service';

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './factura.html',
  styleUrl: './factura.css'
})
export class FacturaComponent implements OnInit, AfterViewInit {

  // 🟢 Captura del elemento select en la vista
  @ViewChild('clienteSelect') clienteSelectInput!: ElementRef<HTMLSelectElement>;

  // Listas generales
  listaFacturas: Factura[] = [];
  listaClientes: Persona[] = [];
  listaArticulos: Articulo[] = [];

  facturaForm!: FormGroup;

  // Lista temporal para la factura que se está armando
  detallesActuales: DetalleFactura[] = [];

  // Selección temporal de la línea de ítem
  articuloSeleccionadoId: number | null = null;
  descripcionLinea: string = '';
  cantidadArticulo: number = 1;
  descuentoLinea: number = 0;

  // Pronto Pago
  aplicaProntoPago: boolean = false;
  porcentajeProntoPago: number = 5;
  montoProntoPago: number = 0;

  // Cálculos globales
  porcentajeIva: number = 16;
  subtotal: number = 0;
  montoDescuentoTotal: number = 0;
  montoIva: number = 0;
  total: number = 0;

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private personaService: PersonaService,
    private articuloService: ArticuloService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarCatalogos();
  }

  // 🟢 Posiciona el foco en el selector de Cliente tras renderizar la vista
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.clienteSelectInput) {
        this.clienteSelectInput.nativeElement.focus();
      }
    }, 100);
  }

  inicializarFormulario(): void {
    this.facturaForm = this.fb.group({
      numeroFactura: [{ value: this.facturaService.generarNumeroFactura(), disabled: true }],
      clienteId: ['', [Validators.required]]
    });
  }

  cargarCatalogos(): void {
    // 1. Cargar historial de facturas
    this.listaFacturas = this.facturaService.getFacturas();

    // 2. Suscribirse al Observable reactivo del personasSubject
    this.personaService.personas$.subscribe({
      next: (personas: Persona[]) => {
        // Filtramos para mostrar únicamente las personas activas
        this.listaClientes = personas.filter((p: Persona) => p.activo);
      },
      error: (err: any) => console.error('Error al escuchar personas en Factura:', err)
    });

    this.personaService.cargarPersonas().subscribe({
      error: (err: any) => console.error('Error al solicitar personas desde Factura:', err)
    });

    // 4. Cargar artículos
    this.articuloService.getArticulos().subscribe({
      next: (articulos: Articulo[]) => {
        this.listaArticulos = articulos.filter((a: Articulo) => a.activo);
      },
      error: (err: any) => console.error('Error al cargar artículos en Factura:', err)
    });
  }

  alSeleccionarArticulo(): void {
    if (this.articuloSeleccionadoId) {
      const art = this.listaArticulos.find(a => a.id === Number(this.articuloSeleccionadoId));
      if (art) {
        this.descripcionLinea = art.descripcion;
      }
    } else {
      this.descripcionLinea = '';
      this.descuentoLinea = 0;
    }
  }

  agregarArticulo(): void {
    if (!this.articuloSeleccionadoId || this.cantidadArticulo <= 0) {
      alert('Seleccione un artículo válido y una cantidad mayor a 0.');
      return;
    }

    const articuloOriginal = this.listaArticulos.find(a => a.id === Number(this.articuloSeleccionadoId));
    if (!articuloOriginal) return;

    const articuloAjustado: Articulo = {
      ...articuloOriginal,
      descripcion: this.descripcionLinea.trim() !== '' ? this.descripcionLinea : articuloOriginal.descripcion
    };

    const subtotalLinea = (articuloAjustado.precioUnitario * this.cantidadArticulo) * (1 - (this.descuentoLinea / 100));

    this.detallesActuales.push({
      articulo: articuloAjustado,
      cantidad: this.cantidadArticulo,
      precioUnitario: articuloAjustado.precioUnitario,
      descuento: this.descuentoLinea,
      subtotal: subtotalLinea
    });

    this.articuloSeleccionadoId = null;
    this.descripcionLinea = '';
    this.cantidadArticulo = 1;
    this.descuentoLinea = 0;

    this.recalcularTotales();
  }

  eliminarDetalle(index: number): void {
    this.detallesActuales.splice(index, 1);
    this.recalcularTotales();
  }

  recalcularTotales(): void {
    this.subtotal = this.detallesActuales.reduce((sum: number, item: DetalleFactura) => sum + (item.precioUnitario * item.cantidad), 0);

    this.montoDescuentoTotal = this.detallesActuales.reduce((sum: number, item: DetalleFactura) => {
      const descUnitario = (item.precioUnitario * (item.descuento / 100));
      return sum + (descUnitario * item.cantidad);
    }, 0);

    const baseParcial = this.subtotal - this.montoDescuentoTotal;

    if (this.aplicaProntoPago) {
      this.montoProntoPago = baseParcial * (this.porcentajeProntoPago / 100);
    } else {
      this.montoProntoPago = 0;
    }

    const baseImponible = baseParcial - this.montoProntoPago;
    this.montoIva = baseImponible * (this.porcentajeIva / 100);
    this.total = baseImponible + this.montoIva;
  }

  guardarFactura(): void {
    if (this.facturaForm.invalid) {
      alert('Por favor seleccione un cliente.');
      return;
    }

    if (this.detallesActuales.length === 0) {
      alert('Debe agregar al menos un artículo a la factura.');
      return;
    }

    const cliente = this.listaClientes.find((c: Persona) => c.id === Number(this.facturaForm.value.clienteId));
    if (!cliente) return;

    const nuevaFactura: Factura = {
      numeroFactura: this.facturaService.generarNumeroFactura(),
      fechaEmision: new Date(),
      cliente,
      detalles: [...this.detallesActuales],
      subtotal: this.subtotal,
      montoDescuentoTotal: this.montoDescuentoTotal,
      aplicaProntoPago: this.aplicaProntoPago,
      montoProntoPago: this.montoProntoPago,
      montoIva: this.montoIva,
      total: this.total,
      estado: 'Pagada'
    };

    this.facturaService.addFactura(nuevaFactura);
    this.cargarCatalogos();
    this.limpiarFormulario();
    alert('Factura generada exitosamente.');
  }

  limpiarFormulario(): void {
    this.facturaForm.reset({
      numeroFactura: this.facturaService.generarNumeroFactura(),
      clienteId: ''
    });
    this.detallesActuales = [];
    this.articuloSeleccionadoId = null;
    this.descripcionLinea = '';
    this.cantidadArticulo = 1;
    this.descuentoLinea = 0;
    this.aplicaProntoPago = false;
    this.montoProntoPago = 0;
    this.recalcularTotales();

    // 🟢 Regresa el foco a Cliente tras guardar/limpiar
    if (this.clienteSelectInput) {
      this.clienteSelectInput.nativeElement.focus();
    }
  }

  anularFactura(id: number): void {
    if (confirm('¿Desea anular esta factura?')) {
      this.facturaService.anularFactura(id);
      this.cargarCatalogos();
    }
  }
}
