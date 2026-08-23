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

  // 🟢 Capturas de elementos del DOM según el patrón estandarizado
  @ViewChild('campoFocus') campoFocusInput!: ElementRef<HTMLInputElement | HTMLSelectElement>;
  @ViewChild('articuloSelect') articuloSelectInput!: ElementRef<HTMLInputElement | HTMLSelectElement>;

  // Listas generales
  listaFacturas: Factura[] = [];
  listaClientes: Persona[] = [];
  clientesFiltrados: Persona[] = [];
  listaArticulos: Articulo[] = [];
  articulosFiltrados: Articulo[] = [];

  // Texto para las cajas de búsqueda
  textoBusquedaCliente: string = '';
  textoBusquedaArticulo: string = '';

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

  ngAfterViewInit(): void {
    setTimeout(() => this.campoFocusInput?.nativeElement?.focus(), 100);
  }

  inicializarFormulario(): void {
    this.facturaForm = this.fb.group({
      numeroFactura: [{ value: this.facturaService.generarNumeroFactura(), disabled: true }],
      clienteId: ['', [Validators.required]]
    });
  }

  cargarCatalogos(): void {
    // 1. Suscripción reactiva al listado de facturas
    this.facturaService.facturas$.subscribe({
      next: (facturas: Factura[]) => {
        this.listaFacturas = facturas;
      },
      error: (err: any) => console.error('Error al escuchar facturas:', err)
    });

    // 2. Petición inicial de facturas al backend
    this.facturaService.cargarFacturas().subscribe({
      error: (err: any) => console.error('Error al cargar historial de facturas:', err)
    });

    // 3. Suscripción y carga de Personas / Clientes
    this.personaService.personas$.subscribe({
      next: (personas: Persona[]) => {
        this.listaClientes = personas.filter((p: Persona) => p.activo);
        this.clientesFiltrados = [...this.listaClientes];
      },
      error: (err: any) => console.error('Error al escuchar personas en Factura:', err)
    });

    this.personaService.cargarPersonas().subscribe({
      error: (err: any) => console.error('Error al solicitar personas desde Factura:', err)
    });

    // 4. Carga de Artículos
    this.articuloService.getArticulos().subscribe({
      next: (articulos: Articulo[]) => {
        this.listaArticulos = articulos.filter((a: Articulo) => a.activo);
        this.articulosFiltrados = [...this.listaArticulos];
      },
      error: (err: any) => console.error('Error al cargar artículos en Factura:', err)
    });
  }

  alBuscarCliente(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value.trim().toUpperCase();
    this.textoBusquedaCliente = input.value;

    if (!valor) {
      this.clientesFiltrados = [...this.listaClientes];
      this.facturaForm.patchValue({ clienteId: '' });
      return;
    }

    this.clientesFiltrados = this.listaClientes.filter((c) => {
      const cedulaSinPrefijo = c.cedula.replace(/^(V|E|J)-/i, '').toUpperCase();
      const cedulaCompleta = c.cedula.toUpperCase();
      const nombreCompleto = `${c.nombre} ${c.apellidos}`.toUpperCase();

      return (
        cedulaSinPrefijo.startsWith(valor) ||
        cedulaCompleta.includes(valor) ||
        nombreCompleto.includes(valor)
      );
    });

    const clienteEncontrado = this.listaClientes.find((c) => {
      const etiquetaOpcion = `${c.cedula} - ${c.nombre} ${c.apellidos}`.toUpperCase();
      return (
        etiquetaOpcion === valor ||
        c.cedula.toUpperCase() === valor ||
        c.cedula.replace(/^(V|E|J)-/i, '').toUpperCase() === valor
      );
    });

    if (clienteEncontrado) {
      this.facturaForm.patchValue({ clienteId: clienteEncontrado.id });
    } else {
      this.facturaForm.patchValue({ clienteId: '' });
    }
  }

  // 🟢 BÚSQUEDA DINÁMICA DE ARTÍCULO (Soporta filtrado por Código o Descripción)
  alBuscarArticulo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value.trim().toUpperCase();
    this.textoBusquedaArticulo = input.value;

    if (!valor) {
      this.articulosFiltrados = [...this.listaArticulos];
      this.articuloSeleccionadoId = null;
      this.descripcionLinea = '';
      return;
    }

    // Filtrar por código que empiece con lo escrito o por coincidencia en la descripción
    this.articulosFiltrados = this.listaArticulos.filter((a) => {
      const codigo = a.codigo.toUpperCase();
      const descripcion = a.descripcion.toUpperCase();
      return codigo.includes(valor) || descripcion.includes(valor);
    });

    // Validar si el texto ingresado coincide exactamente con alguna opción
    const articuloEncontrado = this.listaArticulos.find((a) => {
      const etiquetaFormateada = `${a.codigo} - ${a.descripcion} ($${a.precioUnitario.toFixed(2)})`.toUpperCase();
      return (
        etiquetaFormateada === valor ||
        a.codigo.toUpperCase() === valor
      );
    });

    if (articuloEncontrado) {
      this.articuloSeleccionadoId = articuloEncontrado.id!;
      this.descripcionLinea = articuloEncontrado.descripcion;
    } else {
      this.articuloSeleccionadoId = null;
      this.descripcionLinea = '';
    }
  }

  agregarArticulo(): void {
    if (!this.articuloSeleccionadoId || this.cantidadArticulo <= 0) {
      alert('Seleccione un artículo válido de la lista y una cantidad mayor a 0.');
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

    // Limpieza de campos de la línea
    this.articuloSeleccionadoId = null;
    this.textoBusquedaArticulo = '';
    this.articulosFiltrados = [...this.listaArticulos];
    this.descripcionLinea = '';
    this.cantidadArticulo = 1;
    this.descuentoLinea = 0;

    this.recalcularTotales();

    // 🟢 Regresa el cursor al campo de búsqueda de Artículo
    setTimeout(() => {
      this.articuloSelectInput?.nativeElement?.focus();
    }, 50);
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
      alert('Por favor seleccione un cliente válido de la lista.');
      return;
    }

    if (this.detallesActuales.length === 0) {
      alert('Debe agregar al menos un artículo a la factura.');
      return;
    }

    const clienteIdSeleccionado = Number(this.facturaForm.value.clienteId);
    const cliente = this.listaClientes.find((c: Persona) => c.id === clienteIdSeleccionado);
    if (!cliente) return;

    // 🟢 ESTRUCTURA ALINEADA CON FacturaDTO DE SPRING BOOT
    const nuevaFactura = {
      numeroFactura: this.facturaService.generarNumeroFactura(),
      fechaEmision: new Date(),
      clienteId: clienteIdSeleccionado,
      cliente,
      detalles: this.detallesActuales.map(item => ({
        articuloId: item.articulo.id,
        // 🟢 1. Renombrado a 'descripcionPersonalizada' (como lo espera DetalleFacturaDTO)
        descripcionPersonalizada: item.articulo.descripcion,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        descuento: item.descuento,
        subtotal: item.subtotal
      })),
      subtotal: this.subtotal,
      montoDescuentoTotal: this.montoDescuentoTotal,

      // 🟢 2. Valores explícitos para Pronto Pago
      aplicaProntoPago: Boolean(this.aplicaProntoPago),
      porcentajeProntoPago: this.aplicaProntoPago ? this.porcentajeProntoPago : 0,
      montoProntoPago: this.aplicaProntoPago ? this.montoProntoPago : 0,

      montoIva: this.montoIva,
      total: this.total,
      estado: 'Pagada' as const
    };




    this.facturaService.addFactura(nuevaFactura as any).subscribe({
      next: () => {
        alert('✅ Factura guardada en la base de datos exitosamente.');
        this.limpiarFormulario();
      },
      error: (err: any) => alert(`Error al guardar factura: ${err.error?.message || err.message}`)
    });
  }


  limpiarFormulario(): void {
    this.facturaForm.reset({
      numeroFactura: this.facturaService.generarNumeroFactura(),
      clienteId: ''
    });
    this.textoBusquedaCliente = '';
    this.clientesFiltrados = [...this.listaClientes];

    this.textoBusquedaArticulo = '';
    this.articulosFiltrados = [...this.listaArticulos];

    this.detallesActuales = [];
    this.articuloSeleccionadoId = null;
    this.descripcionLinea = '';
    this.cantidadArticulo = 1;
    this.descuentoLinea = 0;
    this.aplicaProntoPago = false;
    this.montoProntoPago = 0;
    this.recalcularTotales();

    this.campoFocusInput?.nativeElement?.focus();
  }

  anularFactura(id: number): void {
    if (confirm('¿Desea anular esta factura?')) {
      // 🟢 ANULACIÓN HTTP (PUT)
      this.facturaService.anularFactura(id).subscribe({
        next: () => console.log('✅ Factura anulada correctamente'),
        error: (err: any) => alert(`Error al anular la factura: ${err.error?.message || err.message}`)
      });
    }
  }

}
