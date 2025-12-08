import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-page">
      <!-- Partículas de fondo -->
      <div class="particles-bg">
        <div class="particle" *ngFor="let p of particles" [style.left.%]="p.x" [style.animation-delay.s]="p.delay"></div>
      </div>

      <div class="success-container">
        <!-- Estado: Procesando -->
        <div class="success-card" *ngIf="loading">
          <div class="icon-wrapper processing">
            <svg class="spinner-icon" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
            </svg>
          </div>
          <h1 class="title">Procesando tu pago...</h1>
          <p class="description">Estamos confirmando tu compra. Por favor, espera un momento.</p>
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>

        <!-- Estado: Éxito -->
        <div class="success-card" *ngIf="success && !loading">
          <div class="icon-wrapper success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" class="check-circle"/>
              <path d="M8 12.5l2.5 2.5 5.5-5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-mark"/>
            </svg>
          </div>
          <h1 class="title success-title">¡Pago completado con éxito!</h1>
          <p class="description">Tu pedido ha sido procesado correctamente.</p>
          
          <div class="info-box">
            <div class="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>Ticket enviado a tu correo electrónico</span>
            </div>
            <div class="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Redirigiendo a la pantalla principal en <strong>{{countdown}}s</strong></span>
            </div>
          </div>

          <button class="cta-button" (click)="goToDashboard()">
            <span>Ir a la pantalla principal.</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>

        <!-- Estado: Error -->
        <div class="success-card" *ngIf="error && !loading">
          <div class="icon-wrapper error-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h1 class="title error-title">Oops, algo salió mal</h1>
          <p class="description">No pudimos procesar tu pago. Por favor, intenta nuevamente.</p>
          
          <div class="error-box">
            <p>Si el problema persiste, contacta con soporte técnico.</p>
          </div>

          <div class="button-group">
            <button class="cta-button secondary" (click)="goToDashboard()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              <span>Volver al inicio</span>
            </button>
            <button class="cta-button" (click)="retry()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              <span>Reintentar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* === VARIABLES === */
    :host {
      --primary: #6366f1;
      --primary-dark: #4f46e5;
      --accent: #06b6d4;
      --bg-dark: #0f172a;
      --bg-card: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --border: rgba(255,255,255,0.1);
      --success: #10b981;
      --danger: #ef4444;
    }

    /* === LAYOUT BASE === */
    .success-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
      overflow: hidden;
      font-family: 'Inter', -apple-system, sans-serif;
    }

    /* === PARTÍCULAS === */
    .particles-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .particle {
      position: absolute;
      width: 3px;
      height: 3px;
      background: rgba(99, 102, 241, 0.4);
      border-radius: 50%;
      animation: rise 20s infinite ease-in-out;
    }

    @keyframes rise {
      0%, 100% {
        transform: translateY(100vh) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-10vh) scale(1);
        opacity: 0;
      }
    }

    /* === CONTENEDOR === */
    .success-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 600px;
    }

    /* === CARD === */
    .success-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 3rem 2.5rem;
      box-shadow: 0 25px 50px rgba(0,0,0,0.5);
      backdrop-filter: blur(20px);
      animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: center;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* === ICONOS === */
    .icon-wrapper {
      width: 120px;
      height: 120px;
      margin: 0 auto 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .icon-wrapper.processing {
      background: radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent);
      border: 2px solid rgba(99, 102, 241, 0.3);
    }

    .icon-wrapper.success-icon {
      background: radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent);
      border: 2px solid rgba(16, 185, 129, 0.3);
      color: var(--success);
      animation: successPulse 2s ease-in-out infinite;
    }

    .icon-wrapper.error-icon {
      background: radial-gradient(circle, rgba(239, 68, 68, 0.2), transparent);
      border: 2px solid rgba(239, 68, 68, 0.3);
      color: var(--danger);
      animation: errorShake 0.5s ease-in-out;
    }

    @keyframes successPulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 20px rgba(16, 185, 129, 0);
      }
    }

    @keyframes errorShake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    /* === SPINNER === */
    .spinner-icon {
      width: 60px;
      height: 60px;
      animation: rotate 1.5s linear infinite;
    }

    .spinner-icon circle {
      stroke: var(--primary);
      stroke-dasharray: 80, 200;
      stroke-dashoffset: 0;
      animation: dash 1.5s ease-in-out infinite;
    }

    @keyframes rotate {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35px;
      }
      100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124px;
      }
    }

    /* === ANIMACIÓN CHECK === */
    .check-circle {
      stroke-dasharray: 63;
      stroke-dashoffset: 63;
      animation: drawCircle 0.6s ease-out forwards;
    }

    .check-mark {
      stroke-dasharray: 14;
      stroke-dashoffset: 14;
      animation: drawCheck 0.4s ease-out 0.6s forwards;
    }

    @keyframes drawCircle {
      to {
        stroke-dashoffset: 0;
      }
    }

    @keyframes drawCheck {
      to {
        stroke-dashoffset: 0;
      }
    }

    /* === TEXTOS === */
    .title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 1rem;
      color: var(--text);
      line-height: 1.2;
    }

    .title.success-title {
      background: linear-gradient(135deg, var(--success), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .title.error-title {
      color: var(--danger);
    }

    .description {
      font-size: 1.1rem;
      color: var(--text-muted);
      margin: 0 0 2rem;
      line-height: 1.6;
    }

    /* === BARRA DE PROGRESO === */
    .progress-bar {
      width: 100%;
      height: 6px;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 10px;
      overflow: hidden;
      margin-top: 2rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--accent));
      border-radius: 10px;
      animation: fillProgress 2s ease-in-out infinite;
    }

    @keyframes fillProgress {
      0% {
        width: 0%;
      }
      50% {
        width: 70%;
      }
      100% {
        width: 100%;
      }
    }

    /* === INFO BOX === */
    .info-box {
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .info-item svg {
      color: var(--success);
      flex-shrink: 0;
    }

    .info-item strong {
      color: var(--success);
      font-weight: 700;
    }

    /* === ERROR BOX === */
    .error-box {
      background: rgba(239, 68, 68, 0.05);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    /* === BOTONES === */
    .cta-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
    }

    .cta-button:active {
      transform: translateY(0);
    }

    .cta-button.secondary {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
      box-shadow: none;
    }

    .cta-button.secondary:hover {
      border-color: var(--primary);
      color: var(--text);
      background: rgba(99, 102, 241, 0.1);
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* === RESPONSIVE === */
    @media (max-width: 640px) {
      .success-page {
        padding: 1rem;
      }

      .success-card {
        padding: 2rem 1.5rem;
      }

      .title {
        font-size: 1.5rem;
      }

      .description {
        font-size: 1rem;
      }

      .icon-wrapper {
        width: 100px;
        height: 100px;
      }

      .button-group {
        flex-direction: column;
      }

      .cta-button {
        width: 100%;
      }
    }
  `]
})
export class SuccessComponent implements OnInit {
  loading = true;
  success = false;
  error = false;
  countdown = 3;
  particles: Array<{x: number, delay: number}> = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    // Generar partículas de fondo
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * 100,
        delay: Math.random() * 20
      });
    }
  }

  ngOnInit(): void {
    const pedidoId = this.route.snapshot.queryParamMap.get('pedidoId');

    if (!pedidoId) {
      console.error("No se recibió pedidoId");
      this.loading = false;
      this.error = true;
      return;
    }

    this.http.post(`https://tfg-almacen-1.onrender.com/api/pedidos/${pedidoId}/confirmar-pago`, {}, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          console.log('Respuesta del backend:', res);
          this.loading = false;
          this.success = true;
          this.startCountdown();
        },
        error: (err) => {
          console.error('Error al enviar ticket:', err);
          this.loading = false;
          this.error = true;
        }
      });
  }

  startCountdown(): void {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.goToDashboard();
      }
    }, 1000);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  retry(): void {
    window.location.reload();
  }
}