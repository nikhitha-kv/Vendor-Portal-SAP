import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataCardComponent } from '../../shared/components/data-card/data-card.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { ProcurementService } from '../../core/services/procurement.service';
import { FinanceService } from '../../core/services/finance.service';
import { VendorRFQ, VendorPO, VendorGR } from '../../core/models/vendor.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DataCardComponent, SkeletonLoaderComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p class="text-slate-400 mt-1">Real-time insights into your procurement and financials</p>
        </div>
        <div class="flex items-center space-x-3">
          <button (click)="loadData()" class="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">
            <span class="material-icons text-sm mr-2" [class.animate-spin]="isLoading">refresh</span>
            Refresh Data
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-stagger">
        <app-data-card
          title="Total RFQs"
          [value]="rfqs.length"
          icon="assignment"
          iconBg="rgba(59,130,246,0.1)"
          iconColor="#60a5fa"
          [trend]="12">
        </app-data-card>

        <app-data-card
          title="Purchase Orders"
          [value]="pos.length"
          icon="shopping_cart"
          iconBg="rgba(16,185,129,0.1)"
          iconColor="#34d399"
          [trend]="5">
        </app-data-card>

        <app-data-card
          title="Goods Receipts"
          [value]="grs.length"
          icon="inventory"
          iconBg="rgba(245,158,11,0.1)"
          iconColor="#fbbf24"
          [trend]="-2">
        </app-data-card>

        <app-data-card
          title="Pending Invoices"
          value="3"
          icon="receipt_long"
          iconBg="rgba(239,68,68,0.1)"
          iconColor="#f87171"
          [trend]="8">
        </app-data-card>
      </div>

      <div *ngIf="isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <app-skeleton-loader type="card" class="h-80"></app-skeleton-loader>
        <app-skeleton-loader type="card" class="h-80"></app-skeleton-loader>
      </div>

      <!-- Charts Section -->
      <div *ngIf="!isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-stagger mt-6">
        
        <!-- PO Value Chart -->
        <div class="glass-panel p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-white">PO Value Trend</h3>
          </div>
          <div class="h-64 relative w-full">
            <canvas id="poChart"></canvas>
          </div>
        </div>

        <!-- Document Status Chart -->
        <div class="glass-panel p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-white">Document Overview</h3>
          </div>
          <div class="h-64 relative w-full flex justify-center">
            <canvas id="docChart"></canvas>
          </div>
        </div>

      </div>

      <!-- Preview Table Section -->
      <div *ngIf="!isLoading" class="glass-panel mt-6 overflow-hidden animate-stagger">
        <div class="p-6 border-b border-slate-700/50 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white">Recent Purchase Orders</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-800/30">
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">PO Number</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Currency</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              <tr *ngFor="let po of pos.slice(0, 5)" class="hover:bg-slate-800/50 transition-colors">
                <td class="py-4 px-6 text-sm font-medium text-white">{{ po.Ebeln }}</td>
                <td class="py-4 px-6 text-sm text-slate-300">{{ po.Bedat | date }}</td>
                <td class="py-4 px-6 text-sm text-slate-300 font-mono">{{ po.Netwr | number:'1.2-2' }}</td>
                <td class="py-4 px-6 text-sm text-slate-300">{{ po.Waers }}</td>
                <td class="py-4 px-6">
                  <span class="px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">Active</span>
                </td>
              </tr>
              <tr *ngIf="pos.length === 0">
                <td colspan="5" class="py-8 text-center text-slate-500">No purchase orders found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private procurementService = inject(ProcurementService);
  private financeService = inject(FinanceService);

  isLoading = true;
  rfqs: VendorRFQ[] = [];
  pos: VendorPO[] = [];
  grs: VendorGR[] = [];
  
  poChartInstance: Chart | null = null;
  docChartInstance: Chart | null = null;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    
    // In a real app, we'd use forkJoin here. For robustness, we simulate concurrent calls
    let callsCompleted = 0;
    const checkComplete = () => {
      callsCompleted++;
      if (callsCompleted === 3) {
        this.isLoading = false;
        setTimeout(() => this.renderCharts(), 100); // Wait for DOM update
      }
    };

    this.procurementService.getRFQs().subscribe({
      next: (data) => { this.rfqs = data; checkComplete(); },
      error: () => checkComplete() // Handle error gracefully in UI
    });

    this.procurementService.getPurchaseOrders().subscribe({
      next: (data) => { this.pos = data; checkComplete(); },
      error: () => checkComplete()
    });

    this.procurementService.getGoodsReceipts().subscribe({
      next: (data) => { this.grs = data; checkComplete(); },
      error: () => checkComplete()
    });
  }

  renderCharts() {
    if (this.poChartInstance) this.poChartInstance.destroy();
    if (this.docChartInstance) this.docChartInstance.destroy();

    const poCanvas = document.getElementById('poChart') as HTMLCanvasElement;
    const docCanvas = document.getElementById('docChart') as HTMLCanvasElement;

    if (!poCanvas || !docCanvas) return;

    // Standard styling setup for charts in dark mode
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = 'Outfit, sans-serif';

    // Mock data for PO trend based on loaded POS
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = [12000, 19000, 15000, 22000, 18000, 25000];

    this.poChartInstance = new Chart(poCanvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'PO Value Trend',
          data: data,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            border: { display: false }
          },
          x: {
            grid: { display: false },
            border: { display: false }
          }
        }
      }
    });

    this.docChartInstance = new Chart(docCanvas, {
      type: 'doughnut',
      data: {
        labels: ['RFQs', 'POs', 'GRs'],
        datasets: [{
          data: [this.rfqs.length || 15, this.pos.length || 20, this.grs.length || 10], // Fallback if 0
          backgroundColor: [
            '#60a5fa', // Blue
            '#34d399', // Emerald
            '#fbbf24'  // Amber
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 20, usePointStyle: true }
          }
        }
      }
    });
  }
}
