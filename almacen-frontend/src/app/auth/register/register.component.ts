import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [FormsModule] 
})
export class RegisterComponent {
  nombre = '';
  email = '';
  password = '';
}
