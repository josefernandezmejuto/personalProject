import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona.model';

@Component({
  selector: 'app-persona',
  standalone: true,
  // ¡Crucial! Importamos ReactiveFormsModule para que funcionen los formularios
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './persona.html',
  styleUrls: ['./persona.css'],
})
export class PersonaComponent implements OnInit {
  listaPersonas: Persona[] = [];
  personaForm!: FormGroup;
  editandoId: number | null = null; // Nos dirá si estamos creando o editando

  estadosVenezuela: string[] = [
    'Amazonas',
    'Anzoátegui',
    'Apure',
    'Aragua',
    'Barinas',
    'Bolívar',
    'Carabobo',
    'Cojedes',
    'Delta Amacuro',
    'Distrito Capital',
    'Falcon',
    'Guárico',
    'Lara',
    'Mérida',
    'Miranda',
    'Monagas',
    'Nueva Esparta',
    'Portuguesa',
    'Sucre',
    'Táchira',
    'Trujillo',
    'Vargas',
    'Yaracuy',
    'Zulia',
    'Dependencias Federales',
  ];

  ciudadesVenezuela: string[] = [
    'Caracas',
    'Maracaibo',
    'Valencia',
    'Barquisimeto',
    'Maracay',
    'Ciudad Guayana',
    'San Cristóbal',
    'Maturín',
    'Barcelona',
    'Puerto Cruz',
    'Cumaná',
    'Mérida',
    'Barinas',
    'Guayana',
    'Coro',
    'Valera',
    'Guanare',
    'San Fernando de Apure',
    'Los Teques',
    'San Felipe',
    'San Carlos',
    'La Asunción',
    'Tucupita',
    'Puerto Ayacucho',
  ];

  constructor(
    private personaService: PersonaService,
    private fb: FormBuilder,
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    // Escuchar la lista de personas del servicio en tiempo real
    this.personaService.getPersonas().subscribe({
      next: (data) => (this.listaPersonas = data),
      error: (err) => console.error('Error al cargar personas:', err),
    });
  }

  // Estructuramos el formulario emparejado con nuestro Modelo
  inicializarFormulario(): void {
    const validadoresTexto = [
      Validators.required,
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/),
    ];

    this.personaForm = this.fb.group({
      nombre: ['', [...validadoresTexto]],
      apellidos: ['', [...validadoresTexto]],
      cedula: [
        'V-',
        [
          Validators.required,
          Validators.pattern(/^(V|E|J)-(91000000|[0-9]?\d{8}|[0-9]\d{6})$/),
          //Validators.pattern(/^(V|E|J)-(91000000|[0-9]?\d{8}|[0-9]\d{6})$/)
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
      activo: [true], // Por defecto activo
      // Desglosamos la dirección como un sub-grupo reactivo
      direccion: this.fb.group({
        codigoPostal: [
          '1050',
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ .,#/\-]+$/)],
        ],
        urbanizacion: [
          'Sabana Grande',
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ .,#/\-]+$/)],
        ],
        ciudad: [
          'Caracas',
          [
            Validators.required,
            (control) =>
              this.ciudadesVenezuela.includes(control.value) ? null : { ciudadInvalida: true },
          ],
        ],
        provinciaEstado: [
          'Distrito Capital',
          [
            Validators.required,
            (control) =>
              this.estadosVenezuela.includes(control.value) ? null : { estadoInvalido: true },
          ],
        ],
        pais: ['Venezuela', [Validators.required, Validators.pattern(/^Venezuela$/)]],
      }),
    });
  }

  // Se ejecuta al pulsar "Guardar" tanto para Alta como para Edición
  guardarPersona(): void {
    // 1. Una única validación limpia. Si es inválido, mostramos la alerta y salimos.
    if (this.personaForm.invalid) {
      alert('Por favor, rellena todos los campos obligatorios o corrige los errores.');
      return;
    }

    const datosFormulario = this.personaForm.value;

    if (this.editandoId !== null) {
      // Si estamos editando, llamamos a actualizar
      this.personaService.updatePersona(this.editandoId, datosFormulario);
      this.editandoId = null;
    } else {
      // Si no, incluimos una nueva persona
      this.personaService.addPersona(datosFormulario);
    }

    // 💡 2. CORRECCIÓN CRÍTICA: Al resetear, mantenemos los valores por defecto obligatorios
    this.personaForm.reset({
      telefonoCelular: '+58',
      activo: true,
      direccion: {
        pais: 'Venezuela',
        provinciaEstado: '', // Se limpian pero quedan listos
        ciudad: '',
      },
    });
  }

  // Carga los datos de la persona en el formulario para modificarlos
  prepararEditar(persona: Persona): void {
    this.editandoId = persona.id;
    // patchValue rellena automáticamente todos los campos que coincidan en estructura
    this.personaForm.patchValue(persona);
  }

  eliminarPersona(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar a esta persona?')) {
      this.personaService.deletePersona(id);
      // Si estábamos editando justo a esa persona, cancelamos la edición
      if (this.editandoId === id) this.editandoId = null;
    }
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.personaForm.reset({ activo: true });
  }
}
