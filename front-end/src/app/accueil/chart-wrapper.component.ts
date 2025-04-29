import {
    Component,
    ElementRef,
    AfterViewInit,
    Inject,
    PLATFORM_ID,
    ViewChild,
    Input
  } from '@angular/core';
  import { isPlatformBrowser, CommonModule } from '@angular/common';
  
  @Component({
    selector: 'app-chart-wrapper',
    standalone: true,
    imports: [CommonModule],
    template: `<div #chartContainer *ngIf="isBrowser"></div>`
  })
  export class ChartWrapperComponent implements AfterViewInit {
    @Input() type: 'electricite' | 'eau' | 'appareils' = 'electricite';
  
    isBrowser: boolean;
    @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
      this.isBrowser = isPlatformBrowser(platformId);
    }
  
    async ngAfterViewInit() {
      if (!this.isBrowser) return;
  
      const ApexCharts = (await import('apexcharts')).default;
  
      const themeColors = ['#800020', '#001F54', '#556B2F', '#4B0082', '#D4AF37'];
      const baseOptions = {
        chart: { type: 'donut' ,height:'350'},
        fill: { type: 'gradient' },
        dataLabels: {
          enabled: true,
          style: { fontSize: '14px', fontWeight: 'bold', colors: ['#fff'] }
        },
        stroke: { show: true, width: 2, colors: ['#f4f4f4'] },
        legend: {
            floating:'true',
          position: 'left',
          fontSize: '14px',    
          labels: { colors: '#FFF'},
          offsetY:30
        },
        tooltip: { theme: 'dark' },
        responsive: [
          {
            breakpoint: 600, // mobile
            options: {
              chart: {
                height: 250
              },
              plotOptions: {
                pie: {
                  offsetY: 150
                }
              },
              legend: {
                position: 'top'
              }
            }
          }
        ]
      };
  
      let options: any;
  
      if (this.type === 'electricite') {
        const kwhValues = [105, 75, 60, 30, 30];
        options = {
          ...baseOptions,
          series: [35, 25, 20, 10, 10],
          labels: ['Cuisine', 'Salon', 'Chambre', 'Salle de bain', 'Autres'],
          colors: themeColors,
          legend: {
            ...baseOptions.legend,
            formatter: (val: string, opts: any) =>
              `${val} – ${opts.w.globals.series[opts.seriesIndex]}% – ${kwhValues[opts.seriesIndex]} kWh`
          },
          tooltip: {
            y: {
              formatter: (val: number, { seriesIndex }: any) =>
                `${val}% – ${kwhValues[seriesIndex]} kWh`
            }
          }
        };
      } else if (this.type === 'eau') {
        const m3Values = [5.2, 3.6, 2.4, 1.2];
        options = {
          ...baseOptions,
          series: [40, 30, 20, 10],
          labels: ['Douche', 'Cuisine', 'Jardin', 'WC'],
          colors: themeColors,
          legend: {
            ...baseOptions.legend,
            formatter: (val: string, opts: any) =>
              `${val} – ${opts.w.globals.series[opts.seriesIndex]}% – ${m3Values[opts.seriesIndex]} m³`
          },
          tooltip: {
            y: {
              formatter: (val: number, { seriesIndex }: any) =>
                `${val}% – ${m3Values[seriesIndex]} m³`
            }
          }
        };
      } else if (this.type === 'appareils') {
        options = {
          ...baseOptions,
          series: [40, 25, 20, 10, 5],
          labels: ['Réfrigérateur', 'Télévision', 'Lave-linge', 'Ordinateur', 'Micro-ondes'],
          colors: themeColors,
          legend: {
            ...baseOptions.legend,
            formatter: (val: string, opts: any) =>
              `${val} – ${opts.w.globals.series[opts.seriesIndex]}%`
          },
          tooltip: {
            y: {
              formatter: (val: number) => `${val}%`
            }
          }
        };
      }
  
      const chart = new ApexCharts(this.chartContainer.nativeElement, options);
      chart.render();
    }
  }
  