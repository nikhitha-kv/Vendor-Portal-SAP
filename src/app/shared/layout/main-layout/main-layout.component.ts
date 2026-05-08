import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  styles: [`
    :host { display: block; }
    .layout-bg {
      background-color: #050914;
      background-image:
        radial-gradient(at 10% 20%, rgba(59,130,246,0.08) 0px, transparent 50%),
        radial-gradient(at 90% 0%, rgba(99,102,241,0.07) 0px, transparent 50%),
        radial-gradient(at 50% 100%, rgba(59,130,246,0.05) 0px, transparent 50%);
      background-attachment: fixed;
    }
    .grid-overlay {
      background-image:
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 60px 60px;
    }
  `],
  template: `
    <div class="layout-bg min-h-screen flex relative">
      <!-- Grid background -->
      <div class="grid-overlay fixed inset-0 pointer-events-none"></div>

      <app-sidebar></app-sidebar>

      <div class="flex-1 flex flex-col min-h-screen relative" style="margin-left:260px">
        <app-header></app-header>
        <main class="flex-1 overflow-y-auto p-7">
          <div class="max-w-7xl mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {}
