import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <-- ¡Imprescindible!

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // <-- Asegúrate de que está aquí metido
  template: '<router-outlet></router-outlet>' // Si usas template en línea, o bien apuntando a tu templateUrl
})
export class AppComponent {
  title = 'mi-proyecto';
}
