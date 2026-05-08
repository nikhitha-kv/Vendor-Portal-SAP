import { Component, inject, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styles: [`
    :host { display: block; }

    /* ── Page ── */
    .page {
      height: 100vh; width: 100vw;
      display: flex; align-items: center; justify-content: center;
      background: #020510;
      overflow: hidden; position: relative;
    }

    /* ── Canvas particle network ── */
    canvas {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      pointer-events: none; z-index: 0;
    }

    /* ── Gradient orbs ── */
    .orb {
      position: absolute; border-radius: 50%;
      filter: blur(90px); pointer-events: none; z-index: 0;
    }
    .orb1 { width:500px;height:500px; top:-180px; left:-120px;
      background: radial-gradient(circle, rgba(29,78,216,0.35), transparent 70%);
      animation: drift1 18s ease-in-out infinite; }
    .orb2 { width:420px;height:420px; top:-100px; right:-100px;
      background: radial-gradient(circle, rgba(109,40,217,0.28), transparent 70%);
      animation: drift2 15s ease-in-out infinite; }
    .orb3 { width:380px;height:380px; bottom:-100px; left:25%;
      background: radial-gradient(circle, rgba(37,99,235,0.25), transparent 70%);
      animation: drift3 20s ease-in-out infinite; }

    @keyframes drift1 {
      0%,100%{ transform:translate(0,0) scale(1); }
      33%    { transform:translate(40px,-30px) scale(1.1); }
      66%    { transform:translate(-20px,40px) scale(0.9); }
    }
    @keyframes drift2 {
      0%,100%{ transform:translate(0,0) scale(1); }
      40%    { transform:translate(-30px,20px) scale(1.08); }
      70%    { transform:translate(25px,-25px) scale(0.95); }
    }
    @keyframes drift3 {
      0%,100%{ transform:translate(0,0) scale(1); }
      50%    { transform:translate(-20px,-30px) scale(1.12); }
    }



    /* ── Animated border card ── */
    .card-outer {
      position:relative; z-index:10;
      border-radius:26px; padding:2px;
      background: linear-gradient(135deg,
        rgba(37,99,235,0.6), rgba(99,102,241,0.4),
        rgba(139,92,246,0.6), rgba(37,99,235,0.3));
      background-size: 300% 300%;
      animation: border-rotate 4s linear infinite;
      box-shadow:
        0 0 40px rgba(99,102,241,0.3),
        0 0 80px rgba(99,102,241,0.12),
        0 30px 80px rgba(0,0,0,0.6);
    }
    @keyframes border-rotate {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .card {
      width: 420px;
      background: rgba(5,9,22,0.92);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      border-radius: 24px;
      padding: 36px 38px 28px;
      animation: rise 0.7s cubic-bezier(0.16,1,0.3,1) both;
      position: relative; overflow: hidden;
    }
    @keyframes rise {
      from { opacity:0; transform:translateY(28px) scale(0.96); }
      to   { opacity:1; transform:translateY(0)    scale(1); }
    }

    /* Inner shimmer sweep across card */
    .card::before {
      content:''; position:absolute;
      top:-60%; left:-60%; width:60%; height:200%;
      background: linear-gradient(105deg, transparent, rgba(99,102,241,0.06), transparent);
      transform: rotate(15deg);
      animation: card-shimmer 5s ease-in-out infinite;
    }
    @keyframes card-shimmer {
      0%   { left:-60%; }
      50%  { left:120%; }
      100% { left:120%; }
    }

    /* ── Logo ── */
    .logo-row {
      display:flex; align-items:center; gap:14px; margin-bottom:22px;
      animation: rise 0.5s 0.1s both; opacity:0;
    }
    .logo-hex {
      position:relative; width:52px; height:52px; flex-shrink:0;
    }
    .logo-hex-inner {
      width:52px; height:52px; border-radius:16px;
      background: linear-gradient(135deg, #1d4ed8, #6366f1, #8b5cf6);
      display:flex; align-items:center; justify-content:center;
      font-size:1.45rem; font-weight:900; color:white;
      position:relative; z-index:2;
      animation: logo-breathe 3s ease-in-out infinite;
      box-shadow:
        0 0 0 0 rgba(99,102,241,0.4),
        0 0 30px rgba(99,102,241,0.5);
    }
    @keyframes logo-breathe {
      0%,100% { box-shadow: 0 0 20px rgba(99,102,241,0.5),  0 0 50px rgba(99,102,241,0.2); transform:scale(1); }
      50%      { box-shadow: 0 0 35px rgba(99,102,241,0.85), 0 0 80px rgba(99,102,241,0.4); transform:scale(1.05); }
    }
    /* rotating ring */
    .logo-ring {
      position:absolute; inset:-6px; border-radius:22px;
      border:1.5px solid transparent;
      background: conic-gradient(from var(--a), rgba(99,102,241,0.8), rgba(139,92,246,0.6), transparent, transparent, rgba(99,102,241,0.8)) border-box;
      -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
      animation: ring-spin 3s linear infinite;
    }
    @property --a { syntax:'<angle>'; initial-value:0deg; inherits:false; }
    @keyframes ring-spin { to { --a: 360deg; } }

    .logo-info h1 { font-size:1rem; font-weight:800; color:#f1f5f9; letter-spacing:-0.01em; }
    .logo-info p  { font-size:0.7rem; color:#3d4d6a; font-weight:500; margin-top:2px; }

    /* ── Divider ── */
    .divider {
      height:1px; margin:0 0 22px;
      background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3) 50%, transparent);
      position:relative;
    }
    .divider::after {
      content:''; position:absolute; left:50%; top:50%;
      transform:translate(-50%,-50%);
      width:6px; height:6px; border-radius:50%;
      background:#6366f1;
      box-shadow: 0 0 10px #6366f1, 0 0 20px rgba(99,102,241,0.6);
      animation: dot-pulse 2s ease-in-out infinite;
    }
    @keyframes dot-pulse {
      0%,100%{ opacity:1; transform:translate(-50%,-50%) scale(1); }
      50%    { opacity:0.5; transform:translate(-50%,-50%) scale(1.6); }
    }

    /* ── Fields ── */
    .field { margin-bottom:14px; animation:rise 0.5s both; opacity:0; }
    .f1 { animation-delay:0.2s; }
    .f2 { animation-delay:0.28s; }
    .f3 { animation-delay:0.36s; }

    label {
      display:block; font-size:10px; font-weight:700;
      color:#374151; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:7px;
    }
    .iw {
      position:relative;
      background: rgba(13,18,38,0.8);
      border: 1px solid rgba(55,65,100,0.6);
      border-radius: 13px;
      transition: border-color 0.25s, box-shadow 0.25s;
    }
    .iw:focus-within {
      border-color: rgba(99,102,241,0.7);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.12), 0 0 25px rgba(99,102,241,0.08);
    }
    .iw:focus-within label { color:#818cf8; }
    .ic {
      position:absolute; left:13px; top:50%; transform:translateY(-50%);
      color:#1e2d45; font-size:17px !important; transition:color 0.25s;
    }
    .iw:focus-within .ic { color:#818cf8; }
    input {
      width:100%; background:transparent; border:none; outline:none;
      padding:12px 12px 12px 40px;
      color:#e2e8f0; font-size:13.5px; font-family:'Outfit',sans-serif;
    }
    input::placeholder { color:#1e2d45; }
    input[type=password] { padding-right:40px; }
    .eye {
      position:absolute; right:11px; top:50%; transform:translateY(-50%);
      background:none; border:none; cursor:pointer;
      color:#1e2d45; transition:color 0.2s; display:flex; align-items:center;
    }
    .eye:hover { color:#818cf8; }

    .err { display:flex; align-items:center; gap:4px; color:#f87171; font-size:11px; margin-top:5px; }
    .err-banner {
      background:rgba(239,68,68,0.07); border:1px solid rgba(239,68,68,0.22);
      border-radius:11px; padding:10px 14px; margin-bottom:12px;
      display:flex; align-items:center; gap:9px;
      color:#f87171; font-size:12.5px; line-height:1.4;
      animation:rise 0.3s ease;
    }

    /* ── Button ── */
    .btn {
      width:100%; padding:14px; border:none; border-radius:13px;
      cursor:pointer; font-size:13.5px; font-weight:700; letter-spacing:0.04em;
      color:white; position:relative; overflow:hidden;
      background: linear-gradient(135deg, #1d4ed8 0%, #6366f1 45%, #7c3aed 100%);
      background-size:250% 250%;
      animation: grad-anim 5s ease infinite, rise 0.5s 0.42s both;
      opacity:0;
      box-shadow: 0 6px 28px rgba(99,102,241,0.45);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    @keyframes grad-anim {
      0%,100%{ background-position:0% 50%; }
      50%    { background-position:100% 50%; }
    }
    .btn:hover:not(:disabled) {
      transform:translateY(-2px);
      box-shadow:0 12px 40px rgba(99,102,241,0.6);
    }
    .btn:active:not(:disabled){ transform:translateY(0); }
    .btn:disabled{ opacity:0.45; cursor:not-allowed; }

    /* Shimmer on hover */
    .sh {
      position:absolute; inset:0;
      background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.16) 50%,transparent 65%);
      transform:translateX(-100%); transition:transform 0.55s;
    }
    .btn:hover:not(:disabled) .sh { transform:translateX(100%); }

    /* Pulse ring on button */
    .btn::after {
      content:''; position:absolute; inset:0; border-radius:13px;
      border:1.5px solid rgba(99,102,241,0.5);
      animation:btn-ring 2.5s ease-out infinite;
    }
    @keyframes btn-ring {
      0%  { opacity:0.8; transform:scale(1); }
      100%{ opacity:0;   transform:scale(1.08); }
    }

    .spin { animation:sp 1s linear infinite; display:inline-block; }
    @keyframes sp { to{ transform:rotate(360deg); } }

    /* ── Footer ── */
    .footer {
      margin-top:18px; text-align:center; font-size:10px;
      color:#1a2540; letter-spacing:0.03em;
      animation:rise 0.5s 0.55s both; opacity:0;
    }

    /* ── Floating stars ── */
    .star {
      position:absolute; border-radius:50%; pointer-events:none; z-index:0;
      background:white; animation:twinkle ease-in-out infinite;
    }
    @keyframes twinkle {
      0%,100%{ opacity:0.08; transform:scale(1); }
      50%    { opacity:0.5;  transform:scale(1.5); }
    }
  `],
  template: `
    <div class="page">

      <!-- Canvas particle network -->
      <canvas #canvas></canvas>

      <!-- Stars -->
      <div class="star" style="width:1.5px;height:1.5px;top:12%;left:18%;animation-duration:2.8s;animation-delay:0s;"></div>
      <div class="star" style="width:2px;height:2px;top:24%;left:65%;animation-duration:3.5s;animation-delay:0.8s;"></div>
      <div class="star" style="width:1px;height:1px;top:70%;left:30%;animation-duration:4s;animation-delay:1.3s;"></div>
      <div class="star" style="width:2px;height:2px;top:80%;left:75%;animation-duration:2.5s;animation-delay:0.4s;"></div>
      <div class="star" style="width:1.5px;height:1.5px;top:45%;left:8%;animation-duration:3.2s;animation-delay:1.8s;"></div>
      <div class="star" style="width:2px;height:2px;top:55%;left:88%;animation-duration:3.8s;animation-delay:0.6s;"></div>
      <div class="star" style="width:1px;height:1px;top:35%;left:50%;animation-duration:4.5s;animation-delay:2s;"></div>
      <div class="star" style="width:2.5px;height:2.5px;top:90%;left:45%;animation-duration:2.2s;animation-delay:1s;"></div>

      <!-- Orbs -->
      <div class="orb orb1"></div>
      <div class="orb orb2"></div>
      <div class="orb orb3"></div>



      <!-- ── Card ── -->
      <div class="card-outer">
        <div class="card">

          <!-- Logo -->
          <div class="logo-row">
            <div class="logo-hex">
              <div class="logo-ring"></div>
              <div class="logo-hex-inner">K</div>
            </div>
            <div class="logo-info">
              <h1>KaarTech Vendor Portal</h1>
              <p>Enterprise Supply Chain &bull; SAP Integrated</p>
            </div>
          </div>

          <!-- Divider with pulsing center dot -->
          <div class="divider"></div>

          <form [formGroup]="form" (ngSubmit)="submit()">

            <div class="field f1">
              <label>Vendor ID</label>
              <div class="iw">
                <span class="material-icons ic">badge</span>
                <input type="text" formControlName="lifnr" id="vendorId"
                       placeholder="e.g. 11 or 0000000011" autocomplete="username">
              </div>
              <p class="err" *ngIf="form.get('lifnr')?.touched && form.get('lifnr')?.errors?.['required']">
                <span class="material-icons" style="font-size:12px">error</span> Vendor ID is required
              </p>
            </div>

            <div class="field f2">
              <label>Password</label>
              <div class="iw">
                <span class="material-icons ic">lock</span>
                <input [type]="showPwd?'text':'password'" formControlName="password"
                       id="vendorPassword" placeholder="Your SAP password" autocomplete="current-password">
                <button type="button" class="eye" (click)="showPwd=!showPwd">
                  <span class="material-icons" style="font-size:17px">{{showPwd?'visibility_off':'visibility'}}</span>
                </button>
              </div>
              <p class="err" *ngIf="form.get('password')?.touched && form.get('password')?.errors?.['required']">
                <span class="material-icons" style="font-size:12px">error</span> Password is required
              </p>
            </div>

            <div class="err-banner" *ngIf="errMsg">
              <span class="material-icons" style="font-size:17px;flex-shrink:0">report_problem</span>
              {{errMsg}}
            </div>

            <div class="field f3">
              <button type="submit" id="loginBtn" class="btn" [disabled]="form.invalid || loading">
                <div class="sh"></div>
                <span *ngIf="!loading" style="display:flex;align-items:center;justify-content:center;gap:8px;position:relative;z-index:1">
                  <span class="material-icons" style="font-size:17px">login</span> Sign In
                </span>
                <span *ngIf="loading" style="display:flex;align-items:center;justify-content:center;gap:8px;position:relative;z-index:1">
                  <span class="material-icons spin" style="font-size:17px">sync</span> Authenticating…
                </span>
              </button>
            </div>

          </form>

          <div class="footer">Secured by SAP Gateway &bull; KaarTech &copy; 2025</div>

        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    lifnr:    ['', Validators.required],
    password: ['', Validators.required]
  });

  showPwd = false;
  loading = false;
  errMsg  = '';

  private animFrame = 0;

  // ── Canvas Particle Network ──────────────────────────
  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    const ctx    = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const NUM = 70;
    interface Particle { x:number; y:number; vx:number; vy:number; r:number; }

    const pts: Particle[] = Array.from({ length: NUM }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 1.5 + 0.5
    }));

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99,102,241,0.55)';
        ctx.fill();
      }

      // Draw lines between close particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${(1 - d / 130) * 0.25})`;
            ctx.lineWidth   = 0.7;
            ctx.stroke();
          }
        }
        // Lines to mouse
        const dx = pts[i].x - mouse.x;
        const dy = pts[i].y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(139,92,246,${(1 - d / 160) * 0.45})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }

      this.animFrame = requestAnimationFrame(draw);
    };
    draw();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animFrame);
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.errMsg  = '';
    const { lifnr, password } = this.form.value;
    this.auth.login(lifnr, password).subscribe({
      next:  () => { this.loading = false; this.router.navigate(['/dashboard']); },
      error: (err) => { this.loading = false; this.errMsg = err.message || 'Authentication failed.'; }
    });
  }
}
