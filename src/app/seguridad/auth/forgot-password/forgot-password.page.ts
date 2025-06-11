import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  onReset() {
    const { email } = this.resetForm.value;
    this.authService.resetPassword(email)
      .then(() => {
        alert('Correo de recuperación enviado.');
        this.router.navigate(['/auth']);
      })
      .catch(err => {
        alert('Error al enviar correo: ' + err.message);
      });
  }
}
