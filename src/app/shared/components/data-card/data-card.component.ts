import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-panel p-6 relative overflow-hidden group">
      <!-- Glow effect -->
      <div class="absolute -inset-1 bg-gradient-to-r [background-image:var(--gradient-color)] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
      
      <div class="relative flex items-center justify-between z-10">
        <div>
          <p class="text-slate-400 text-sm font-medium tracking-wide uppercase mb-1">{{ title }}</p>
          <h3 class="text-3xl font-bold text-white">{{ value }}</h3>
          
          <div *ngIf="trend" class="mt-2 flex items-center text-sm" [ngClass]="trend > 0 ? 'text-emerald-400' : 'text-red-400'">
            <span class="material-icons text-sm mr-1">{{ trend > 0 ? 'trending_up' : 'trending_down' }}</span>
            <span>{{ Math.abs(trend) }}% from last month</span>
          </div>
        </div>
        
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" [ngStyle]="{'background': iconBg}">
          <span class="material-icons text-3xl" [ngStyle]="{'color': iconColor}">{{ icon }}</span>
        </div>
      </div>
    </div>
  `
})
export class DataCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = '';
  @Input() trend?: number;
  @Input() gradientClass: string = 'from-blue-600 to-indigo-600';
  @Input() iconBg: string = 'rgba(59,130,246,0.1)';
  @Input() iconColor: string = '#60a5fa';

  Math = Math; // Make Math available in template
}
