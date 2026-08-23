import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona.model';

export interface Estado {
  codigo: string;
  nombre: string;
}

export interface Ciudad {
  codigo: string;
  nombre: string;
  codigoEstado: string;
}

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './persona.html',
  styleUrls: ['./persona.css'],
})
export class PersonaComponent implements OnInit, AfterViewInit {
  listaPersonas: Persona[] = [];
  personaForm!: FormGroup;
  editandoId: number | null = null;
  ciudadesFiltradas: Ciudad[] = [];

  @ViewChild('campoFocus') campoFocusInput!: ElementRef<HTMLInputElement | HTMLSelectElement>;

  estadosVenezuela: Estado[] = [
    { codigo: '001', nombre: 'Amazonas' },
    { codigo: '002', nombre: 'Anzoátegui' },
    { codigo: '003', nombre: 'Apure' },
    { codigo: '004', nombre: 'Aragua' },
    { codigo: '005', nombre: 'Barinas' },
    { codigo: '006', nombre: 'Bolívar' },
    { codigo: '007', nombre: 'Carabobo' },
    { codigo: '008', nombre: 'Cojedes' },
    { codigo: '009', nombre: 'Delta Amacuro' },
    { codigo: '010', nombre: 'Dependencias Federales' },
    { codigo: '011', nombre: 'Distrito Capital' },
    { codigo: '012', nombre: 'Falcón' },
    { codigo: '013', nombre: 'Guárico' },
    { codigo: '014', nombre: 'Lara' },
    { codigo: '015', nombre: 'Mérida' },
    { codigo: '016', nombre: 'Miranda' },
    { codigo: '017', nombre: 'Monagas' },
    { codigo: '018', nombre: 'Nueva Esparta' },
    { codigo: '019', nombre: 'Portuguesa' },
    { codigo: '020', nombre: 'Sucre' },
    { codigo: '021', nombre: 'Táchira' },
    { codigo: '022', nombre: 'Trujillo' },
    { codigo: '023', nombre: 'La Guaira (Vargas)' },
    { codigo: '024', nombre: 'Yaracuy' },
    { codigo: '025', nombre: 'Zulia' }
  ];

  ciudadesVenezuela: Ciudad[] = [
    { codigo: 'C001', nombre: 'Puerto Ayacucho', codigoEstado: '001' },
    { codigo: 'C002', nombre: 'San Fernando de Atabapo', codigoEstado: '001' },
    { codigo: 'C003', nombre: 'Barcelona', codigoEstado: '002' },
    { codigo: 'C004', nombre: 'Puerto La Cruz', codigoEstado: '002' },
    { codigo: 'C005', nombre: 'El Tigre', codigoEstado: '002' },
    { codigo: 'C006', nombre: 'Anaco', codigoEstado: '002' },
    { codigo: 'C007', nombre: 'San Fernando de Apure', codigoEstado: '003' },
    { codigo: 'C008', nombre: 'Achaguas', codigoEstado: '003' },
    { codigo: 'C009', nombre: 'Guasdualito', codigoEstado: '003' },
    { codigo: 'C010', nombre: 'Maracay', codigoEstado: '004' },
    { codigo: 'C011', nombre: 'Turmero', codigoEstado: '004' },
    { codigo: 'C012', nombre: 'La Victoria', codigoEstado: '004' },
    { codigo: 'C013', nombre: 'Cagua', codigoEstado: '004' },
    { codigo: 'C014', nombre: 'Barinas', codigoEstado: '005' },
    { codigo: 'C015', nombre: 'Socopó', codigoEstado: '005' },
    { codigo: 'C016', nombre: 'Sabaneta', codigoEstado: '005' },
    { codigo: 'C017', nombre: 'Ciudad Guayana (Puerto Ordaz/San Félix)', codigoEstado: '006' },
    { codigo: 'C018', nombre: 'Ciudad Bolívar', codigoEstado: '006' },
    { codigo: 'C019', nombre: 'Upata', codigoEstado: '006' },
    { codigo: 'C020', nombre: 'Valencia', codigoEstado: '007' },
    { codigo: 'C021', nombre: 'Puerto Cabello', codigoEstado: '007' },
    { codigo: 'C022', nombre: 'Guacara', codigoEstado: '007' },
    { codigo: 'C023', nombre: 'Naguanagua', codigoEstado: '007' },
    { codigo: 'C024', nombre: 'San Carlos', codigoEstado: '008' },
    { codigo: 'C025', nombre: 'Tinaquillo', codigoEstado: '008' },
    { codigo: 'C026', nombre: 'Tucupita', codigoEstado: '009' },
    { codigo: 'C027', nombre: 'Gran Roque (Los Roques)', codigoEstado: '010' },
    { codigo: 'C028', nombre: 'Caracas', codigoEstado: '011' },
    { codigo: 'C029', nombre: 'Coro', codigoEstado: '012' },
    { codigo: 'C030', nombre: 'Punto Fijo', codigoEstado: '012' },
    { codigo: 'C031', nombre: 'San Juan de los Morros', codigoEstado: '013' },
    { codigo: 'C032', nombre: 'Valle de la Pascua', codigoEstado: '013' },
    { codigo: 'C033', nombre: 'Calabozo', codigoEstado: '013' },
    { codigo: 'C034', nombre: 'Barquisimeto', codigoEstado: '014' },
    { codigo: 'C035', nombre: 'Cabudare', codigoEstado: '014' },
    { codigo: 'C036', nombre: 'Carora', codigoEstado: '014' },
    { codigo: 'C037', nombre: 'Mérida', codigoEstado: '015' },
    { codigo: 'C038', nombre: 'El Vigía', codigoEstado: '015' },
    { codigo: 'C039', nombre: 'Tovar', codigoEstado: '015' },
    { codigo: 'C040', nombre: 'Los Teques', codigoEstado: '016' },
    { codigo: 'C041', nombre: 'Guarenas', codigoEstado: '016' },
    { codigo: 'C042', nombre: 'Guatire', codigoEstado: '016' },
    { codigo: 'C043', nombre: 'Charallave', codigoEstado: '016' },
    { codigo: 'C044', nombre: 'Maturín', codigoEstado: '017' },
    { codigo: 'C045', nombre: 'Caripe', codigoEstado: '017' },
    { codigo: 'C046', nombre: 'Porlamar', codigoEstado: '018' },
    { codigo: 'C047', nombre: 'La Asunción', codigoEstado: '018' },
    { codigo: 'C048', nombre: 'Pampatar', codigoEstado: '018' },
    { codigo: 'C049', nombre: 'Guanare', codigoEstado: '019' },
    { codigo: 'C050', nombre: 'Acarigua', codigoEstado: '019' },
    { codigo: 'C051', nombre: 'Cumaná', codigoEstado: '020' },
    { codigo: 'C052', nombre: 'Carúpano', codigoEstado: '020' },
    { codigo: 'C053', nombre: 'San Cristóbal', codigoEstado: '021' },
    { codigo: 'C054', nombre: 'Tábaiba', codigoEstado: '021' },
    { codigo: 'C055', nombre: 'Rubio', codigoEstado: '021' },
    { codigo: 'C056', nombre: 'Trujillo', codigoEstado: '022' },
    { codigo: 'C057', nombre: 'Valera', codigoEstado: '022' },
    { codigo: 'C058', nombre: 'La Guaira', codigoEstado: '023' },
    { codigo: 'C059', nombre: 'Maiquetía', codigoEstado: '023' },
    { codigo: 'C060', nombre: 'Catia La Mar', codigoEstado: '023' },
    { codigo: 'C061', nombre: 'San Felipe', codigoEstado: '024' },
    { codigo: 'C062', nombre: 'Yaritagua', codigoEstado: '024' },
    { codigo: 'C063', nombre: 'Maracaibo', codigoEstado: '025' },
    { codigo: 'C064', nombre: 'Cabimas', codigoEstado: '025' },
    { codigo: 'C065', nombre: 'Ciudad Ojeda', codigoEstado: '025' }
  ];

  constructor(
    private personaService: PersonaService,
    private fb: FormBuilder
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.personaService.personas$.subscribe({
      next: (data) => (this.listaPersonas = data),
      error: (err: any) => console.error('Error en el estado local de personas:', err),
    });

    this.cargarPersonasDesdeBackend();
    this.escucharCambiosEstado();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.campoFocusInput?.nativeElement?.focus(), 100);
  }

  escucharCambiosEstado(): void {
    this.personaForm.get('direccion.provinciaEstado')?.valueChanges.subscribe((codigoEstado) => {
      if (codigoEstado) {
        this.ciudadesFiltradas = this.ciudadesVenezuela.filter(c => c.codigoEstado === codigoEstado);

        const ciudadActual = this.personaForm.get('direccion.ciudad')?.value;
        const perteneceAlNuevoEstado = this.ciudadesFiltradas.some(c => c.codigo === ciudadActual);

        if (!perteneceAlNuevoEstado) {
          this.personaForm.get('direccion.ciudad')?.setValue('');
        }
      } else {
        this.ciudadesFiltradas = [];
        this.personaForm.get('direccion.ciudad')?.setValue('');
      }
    });
  }

  cargarPersonasDesdeBackend(): void {
    this.personaService.cargarPersonas().subscribe({
      error: (err: any) => console.error('Error al cargar personas desde el Backend:', err)
    });
  }

  inicializarFormulario(): void {
    const validadoresTexto = [
      Validators.required,
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/),
    ];

    this.ciudadesFiltradas = this.ciudadesVenezuela.filter(c => c.codigoEstado === '011');

    this.personaForm = this.fb.group({
      nombre: ['', [...validadoresTexto]],
      apellidos: ['', [...validadoresTexto]],
      cedula: [
        'V-',
        [
          Validators.required,
          Validators.pattern(/^(V|E|J)-(91000000|[0-9]?\d{8}|[0-9]\d{6})$/),
        ],
      ],
      email: [
        '@gmail.com',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
        ],
      ],
      telefonoFijo: ['+58212', [Validators.required, Validators.pattern(/^\+58(212)\d{7}$/)]],
      telefonoCelular: [
        '+584',
        [Validators.required, Validators.pattern(/^\+58(412|416|424|426)\d{7}$/)],
      ],
      activo: [true],
      direccion: this.fb.group({
        codigoPostal: [
          '1050',
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ .,#/\-]+$/)],
        ],
        urbanizacion: [
          'Sabana Grande',
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ .,#/\-]+$/)],
        ],
        provinciaEstado: ['011', [Validators.required]],
        ciudad: ['C028', [Validators.required]],
        pais: ['Venezuela', [Validators.required]],
      }),
    });
  }

  guardarPersona(event?: Event): void {
    if (event) event.preventDefault();

    if (this.personaForm.invalid) {
      alert('Por favor, rellena todos los campos obligatorios o corrige los errores.');
      return;
    }

    const datosFormulario = this.personaForm.value;
    const cedulaIngresada = datosFormulario.cedula.trim().toUpperCase();

    // 🟢 VALIDACIÓN DE CÉDULA ÚNICA
    const cedulaExiste = this.listaPersonas.some((persona) => {
      const mismaCedula = persona.cedula.trim().toUpperCase() === cedulaIngresada;
      if (this.editandoId !== null) {
        // En modo edición ignora a la persona que se está modificando actualmente
        return mismaCedula && persona.id !== this.editandoId;
      }
      return mismaCedula;
    });

    if (cedulaExiste) {
      alert(`La cédula "${cedulaIngresada}" ya se encuentra registrada a nombre de otra persona.`);
      return;
    }

    if (this.editandoId !== null) {
      this.personaService.updatePersona(this.editandoId, datosFormulario).subscribe({
        next: () => {
          alert('Persona actualizada con éxito');
          this.resetearFormulario();
        },
        error: (err: any) => alert(`Error al actualizar: ${err.error?.message || err.message}`)
      });
    } else {
      this.personaService.addPersona(datosFormulario).subscribe({
        next: () => {
          alert('Persona creada con éxito');
          this.resetearFormulario();
        },
        error: (err: any) => alert(`Error al guardar: ${err.error?.message || err.message}`)
      });
    }
  }

  prepararEditar(persona: Persona): void {
    this.editandoId = persona.id;
    const codEstado = persona.direccion?.provinciaEstado;
    if (codEstado) {
      this.ciudadesFiltradas = this.ciudadesVenezuela.filter(c => c.codigoEstado === codEstado);
    }
    this.personaForm.patchValue(persona);
    this.campoFocusInput?.nativeElement?.focus();
  }

  eliminarPersona(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar a esta persona?')) {
      this.personaService.deletePersona(id).subscribe({
        next: () => {
          if (this.editandoId === id) this.editandoId = null;
        },
        error: (err: any) => alert(`Error al eliminar: ${err.error?.message || 'Error en el servidor'}`)
      });
    }
  }

  cancelarEdicion(): void {
    this.resetearFormulario();
  }

  obtenerNombreUbicacion(codigo: string, tipo: 'estado' | 'ciudad'): string {
    if (tipo === 'estado') {
      return this.estadosVenezuela.find(e => e.codigo === codigo)?.nombre || codigo;
    } else {
      return this.ciudadesVenezuela.find(c => c.codigo === codigo)?.nombre || codigo;
    }
  }

  private resetearFormulario(): void {
    this.editandoId = null;
    this.ciudadesFiltradas = this.ciudadesVenezuela.filter(c => c.codigoEstado === '011');

    this.personaForm.reset({
      cedula: 'V-',
      email: '@gmail.com',
      telefonoFijo: '+58212',
      telefonoCelular: '+584',
      activo: true,
      direccion: {
        pais: 'Venezuela',
        provinciaEstado: '011',
        ciudad: 'C028',
        codigoPostal: '1050',
        urbanizacion: 'Sabana Grande'
      }
    });
    this.campoFocusInput?.nativeElement?.focus();
  }
}
