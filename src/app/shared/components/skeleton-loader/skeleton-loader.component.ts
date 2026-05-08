import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngSwitch]="type" class="w-full">
      <!-- Table Skeleton -->
      <div *ngSwitchCase="'table'" class="glass-panel p-6 animate-pulse">
        <div class="h-8 bg-slate-700/50 rounded w-1/4 mb-6"></div>
        <div class="space-y-4">
          <div class="h-10 bg-slate-800/80 rounded w-full"></div>
          <div class="h-12 bg-slate-800/40 rounded w-full"></div>
          <div class="h-12 bg-slate-800/40 rounded w-full"></div>
          <div class="h-12 bg-slate-800/40 rounded w-full"></div>
          <div class="h-12 bg-slate-800/40 rounded w-full"></div>
        </div>
      </div>

      <!-- Card Skeleton -->
      <div *ngSwitchCase="'card'" class="glass-panel p-6 animate-pulse h-32">
        <div class="flex justify-between">
          <div class="space-y-3 w-1/2">
            <div class="h-4 bg-slate-700/50 rounded w-full"></div>
            <div class="h-8 bg-slate-700/80 rounded w-3/4"></div>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-slate-700/50"></div>
        </div>
      </div>

      <!-- Profile Skeleton -->
      <div *ngSwitchCase="'profile'" class="glass-panel p-8 animate-pulse">
        <div class="flex items-start space-x-6">
          <div class="w-24 h-24 rounded-full bg-slate-700/50"></div>
          <div class="space-y-4 flex-1">
            <div class="h-8 bg-slate-700/80 rounded w-1/3"></div>
            <div class="h-4 bg-slate-700/50 rounded w-1/4"></div>
            <div class="grid grid-cols-2 gap-6 mt-8">
              <div class="h-12 bg-slate-800/50 rounded"></div>
              <div class="h-12 bg-slate-800/50 rounded"></div>
              <div class="h-12 bg-slate-800/50 rounded"></div>
              <div class="h-12 bg-slate-800/50 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SkeletonLoaderComponent {
  @Input() type: 'table' | 'card' | 'profile' = 'table';
}
