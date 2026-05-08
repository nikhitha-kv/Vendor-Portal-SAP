import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../../../core/services/finance.service';
import { VendorAging } from '../../../core/models/vendor.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-aging',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  styles: [`
    .bar-track {
      height: 6px; border-radius: 99px;
      background: rgba(255,255,255,0.05);
      overflow: hidden;
    }
    .bar-fill {
      height: 100%; border-radius: 99px;
      transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
    }
    .risk-row { transition: all 0.18s ease; }
    .risk-row:hover { background: rgba(255,255,255,0.03); }
  `],
  template: `
    <div class="space-y-6 stagger">

      <!-- Header -->
      <div class="flex items-center justify-between mb-2">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Aging Analysis</h1>
          <p class="text-slate-500 text-sm mt-1">Outstanding payables grouped by overdue age bucket</p>
        </div>
        <div class="flex items-center gap-2 text-[11px] font-medium text-slate-500">
          <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>Current
          <span class="w-2 h-2 rounded-full bg-amber-400 inline-block ml-2"></span>Moderate
          <span class="w-2 h-2 rounded-full bg-red-400 inline-block ml-2"></span>Critical
        </div>
      </div>

      <!-- Skeleton -->
      <div *ngIf="isLoading" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <app-skeleton-loader type="card" class="h-28"></app-skeleton-loader>
          <app-skeleton-loader type="card" class="h-28"></app-skeleton-loader>
          <app-skeleton-loader type="card" class="h-28"></app-skeleton-loader>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <app-skeleton-loader type="card" class="lg:col-span-4 h-80"></app-skeleton-loader>
          <app-skeleton-loader type="table" class="lg:col-span-8"></app-skeleton-loader>
        </div>
      </div>

      <div *ngIf="!isLoading" class="space-y-6 animate-stagger">

        <!-- KPI Bucket Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">

          <!-- 0-30 Days -->
          <div class="glass-panel p-5 border-l-[3px] border-l-emerald-500 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-emerald-500/70">Current</p>
                <p class="text-slate-300 text-sm mt-0.5">0 – 30 Days</p>
              </div>
              <span class="material-icons text-emerald-500/40" style="font-size:28px">check_circle</span>
            </div>
            <p class="text-2xl font-bold text-emerald-400 font-mono">{{ bucket0_30 | number:'1.2-2' }}</p>
            <div class="bar-track mt-3">
              <div class="bar-fill bg-emerald-400" [style.width]="pct(bucket0_30) + '%'"></div>
            </div>
            <p class="text-[10px] text-slate-600 mt-1">{{ count0_30 }} item(s) · {{ pct(bucket0_30) | number:'1.0-0' }}% of total</p>
          </div>

          <!-- 30-60 Days -->
          <div class="glass-panel p-5 border-l-[3px] border-l-amber-500 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none"></div>
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-amber-500/70">Moderate</p>
                <p class="text-slate-300 text-sm mt-0.5">30 – 60 Days</p>
              </div>
              <span class="material-icons text-amber-500/40" style="font-size:28px">schedule</span>
            </div>
            <p class="text-2xl font-bold text-amber-400 font-mono">{{ bucket30_60 | number:'1.2-2' }}</p>
            <div class="bar-track mt-3">
              <div class="bar-fill bg-amber-400" [style.width]="pct(bucket30_60) + '%'"></div>
            </div>
            <p class="text-[10px] text-slate-600 mt-1">{{ count30_60 }} item(s) · {{ pct(bucket30_60) | number:'1.0-0' }}% of total</p>
          </div>

          <!-- 60+ Days -->
          <div class="glass-panel p-5 border-l-[3px] border-l-red-500 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none"></div>
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-red-500/70">Critical</p>
                <p class="text-slate-300 text-sm mt-0.5">60+ Days</p>
              </div>
              <span class="material-icons text-red-500/40" style="font-size:28px">warning_amber</span>
            </div>
            <p class="text-2xl font-bold text-red-400 font-mono">{{ bucket60_plus | number:'1.2-2' }}</p>
            <div class="bar-track mt-3">
              <div class="bar-fill bg-red-400" [style.width]="pct(bucket60_plus) + '%'"></div>
            </div>
            <p class="text-[10px] text-slate-600 mt-1">{{ count60_plus }} item(s) · {{ pct(bucket60_plus) | number:'1.0-0' }}% of total</p>
          </div>
        </div>

        <!-- Chart + Table -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <!-- Donut Chart Panel -->
          <div class="lg:col-span-4 glass-panel p-6 flex flex-col">
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">Distribution</h3>

            <div class="h-52 relative flex justify-center items-center">
              <canvas id="agingChart"></canvas>
              <!-- Center Label -->
              <div class="absolute flex flex-col items-center pointer-events-none">
                <span class="text-xs text-slate-500 font-medium">Total</span>
                <span class="text-lg font-bold text-white font-mono">{{ totalAmount | number:'1.0-0' }}</span>
              </div>
            </div>

            <div class="mt-6 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-2.5 h-2.5 rounded-sm bg-emerald-400 shrink-0"></div>
                  <span class="text-slate-400 text-sm">0 – 30 Days</span>
                </div>
                <div class="text-right">
                  <span class="font-mono text-sm text-white">{{ bucket0_30 | number:'1.2-2' }}</span>
                  <span class="text-slate-600 text-[10px] ml-1">{{ firstCurrency }}</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-2.5 h-2.5 rounded-sm bg-amber-400 shrink-0"></div>
                  <span class="text-slate-400 text-sm">30 – 60 Days</span>
                </div>
                <div class="text-right">
                  <span class="font-mono text-sm text-white">{{ bucket30_60 | number:'1.2-2' }}</span>
                  <span class="text-slate-600 text-[10px] ml-1">{{ firstCurrency }}</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-2.5 h-2.5 rounded-sm bg-red-400 shrink-0"></div>
                  <span class="text-slate-400 text-sm">60+ Days</span>
                </div>
                <div class="text-right">
                  <span class="font-mono text-sm text-white">{{ bucket60_plus | number:'1.2-2' }}</span>
                  <span class="text-slate-600 text-[10px] ml-1">{{ firstCurrency }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Table Panel -->
          <div class="lg:col-span-8 glass-panel overflow-hidden flex flex-col">
            <div class="px-6 py-4 border-b border-blue-500/10 flex items-center justify-between">
              <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">Outstanding Items</h3>
              <span class="text-[11px] text-slate-600 font-medium">{{ agingData.length }} record(s)</span>
            </div>
            <div class="overflow-y-auto overflow-x-auto flex-1" style="max-height: 420px">
              <table class="w-full text-left border-collapse">
                <thead class="sticky top-0 z-10 bg-[#0a0f22]">
                  <tr class="border-b border-blue-500/10">
                    <th class="py-3 px-5 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest bg-[#0a0f22]">Doc No</th>
                    <th class="py-3 px-5 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest bg-[#0a0f22]">Posting Date</th>
                    <th class="py-3 px-5 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest bg-[#0a0f22]">Due Date</th>
                    <th class="py-3 px-5 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest bg-[#0a0f22]">Age</th>
                    <th class="py-3 px-5 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest bg-[#0a0f22]">Bucket</th>
                    <th class="py-3 px-5 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest text-right bg-[#0a0f22]">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of agingData" class="risk-row border-b border-blue-500/5 last:border-0">
                    <td class="py-3.5 px-5 font-mono font-bold text-blue-400 text-sm">{{ item.Belnr }}</td>
                    <td class="py-3.5 px-5 text-sm text-slate-400">{{ item.Budat | date:'dd MMM yyyy' }}</td>
                    <td class="py-3.5 px-5 text-sm text-slate-400">{{ item.DueDate | date:'dd MMM yyyy' }}</td>
                    <td class="py-3.5 px-5">
                      <div class="flex items-center gap-2">
                        <div class="bar-track w-16">
                          <div class="bar-fill"
                               [style.width]="ageDaysPct(item.AgingDays) + '%'"
                               [ngClass]="{'bg-emerald-400': item.AgingDays <= 30, 'bg-amber-400': item.AgingDays > 30 && item.AgingDays <= 60, 'bg-red-400': item.AgingDays > 60}">
                          </div>
                        </div>
                        <span class="font-mono text-sm font-semibold"
                              [ngClass]="{'text-emerald-400': item.AgingDays <= 30, 'text-amber-400': item.AgingDays > 30 && item.AgingDays <= 60, 'text-red-400': item.AgingDays > 60}">
                          {{ item.AgingDays }}d
                        </span>
                      </div>
                    </td>
                    <td class="py-3.5 px-5">
                      <span *ngIf="item.AgingDays <= 30"   class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Current</span>
                      <span *ngIf="item.AgingDays > 30 && item.AgingDays <= 60" class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Moderate</span>
                      <span *ngIf="item.AgingDays > 60"   class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Critical</span>
                    </td>
                    <td class="py-3.5 px-5 text-sm font-mono text-white text-right">
                      {{ item.Amount | number:'1.2-2' }}
                      <span class="text-slate-500 text-[10px] ml-1">{{ item.Waers }}</span>
                    </td>
                  </tr>
                  <tr *ngIf="agingData.length === 0">
                    <td colspan="6" class="py-14 text-center">
                      <span class="material-icons text-4xl text-slate-700 block mb-2">pie_chart</span>
                      <p class="text-slate-500 text-sm">No outstanding items found</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="px-5 py-3 border-t border-blue-500/8 bg-slate-900/30 text-xs text-slate-600 flex justify-between shrink-0">
              <span>{{ agingData.length }} records</span>
              <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Live SAP OData</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class AgingComponent implements OnInit {
  private financeService = inject(FinanceService);
  private chartInstance: Chart | null = null;

  isLoading = true;
  agingData: VendorAging[] = [];

  bucket0_30 = 0;
  bucket30_60 = 0;
  bucket60_plus = 0;

  count0_30 = 0;
  count30_60 = 0;
  count60_plus = 0;

  get totalAmount() { return this.bucket0_30 + this.bucket30_60 + this.bucket60_plus; }
  get firstCurrency() { return this.agingData[0]?.Waers ?? ''; }

  pct(val: number) {
    if (!this.totalAmount) return 0;
    return Math.round((val / this.totalAmount) * 100);
  }

  ageDaysPct(days: number) {
    const max = Math.max(...this.agingData.map(d => d.AgingDays), 1);
    return Math.round((days / max) * 100);
  }

  ngOnInit() {
    this.financeService.getAging().subscribe({
      next: (data) => {
        this.agingData = data;
        this.calculateBuckets();
        this.isLoading = false;
        setTimeout(() => this.renderChart(), 100);
      },
      error: () => {
        this.agingData = [
          { Lifnr: '11', Belnr: '3000000010', Budat: '2025-01-01', DueDate: '2025-01-31', AgingDays: 15, Amount: 1500.00, Waers: 'INR' },
          { Lifnr: '11', Belnr: '3000000011', Budat: '2024-12-01', DueDate: '2024-12-31', AgingDays: 45, Amount: 3200.50, Waers: 'INR' },
          { Lifnr: '11', Belnr: '3000000012', Budat: '2024-11-01', DueDate: '2024-11-30', AgingDays: 75, Amount: 800.00, Waers: 'INR' }
        ];
        this.calculateBuckets();
        this.isLoading = false;
        setTimeout(() => this.renderChart(), 100);
      }
    });
  }

  calculateBuckets() {
    this.bucket0_30 = this.bucket30_60 = this.bucket60_plus = 0;
    this.count0_30 = this.count30_60 = this.count60_plus = 0;

    this.agingData.forEach(item => {
      const amt = Number(item.Amount || 0);
      if (item.AgingDays <= 30)       { this.bucket0_30 += amt;   this.count0_30++; }
      else if (item.AgingDays <= 60)  { this.bucket30_60 += amt;  this.count30_60++; }
      else                             { this.bucket60_plus += amt; this.count60_plus++; }
    });
  }

  renderChart() {
    const canvas = document.getElementById('agingChart') as HTMLCanvasElement;
    if (!canvas) return;

    // Destroy previous instance to avoid 'canvas already in use' error
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = 'Outfit, sans-serif';

    // Build labels and data only for non-zero buckets
    const allLabels  = ['0-30 Days', '30-60 Days', '60+ Days'];
    const allColors  = ['#34d399', '#fbbf24', '#f87171'];
    const allValues  = [this.bucket0_30, this.bucket30_60, this.bucket60_plus];

    // Filter to non-zero only so empty slices are hidden
    const labels: string[] = [];
    const values: number[] = [];
    const colors: string[] = [];
    allValues.forEach((v, i) => {
      if (v > 0) { labels.push(allLabels[i]); values.push(v); colors.push(allColors[i]); }
    });

    // If everything is zero, show a placeholder
    const hasData = values.length > 0;

    this.chartInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: hasData ? labels : ['No Data'],
        datasets: [{
          data: hasData ? values : [1],
          backgroundColor: hasData ? colors : ['rgba(255,255,255,0.05)'],
          borderWidth: hasData ? 3 : 1,
          borderColor: '#080e22',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: hasData,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${Number(ctx.raw).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
            }
          }
        }
      }
    });
  }
}
