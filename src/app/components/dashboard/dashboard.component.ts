import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
	
	// Chart
	
	public chartType: string = 'line';

	public chartDatasets: Array<any> = [
	  { data: [200, 220], label: '$10' },
	  { data: [150, 50], label: '$50' }
	];
  
	public chartLabels: Array<any> = ['April', 'May'];
  
	public chartColors: Array<any> = [
	  {
		backgroundColor: 'rgba(57, 126, 245, .2)',
		borderColor: 'rgba(33, 111, 206, .7)',
		borderWidth: 2,
	  },
	  {
		backgroundColor: 'rgba(66, 213, 131, .2)',
		borderColor: 'rgba(52, 191, 108, .7)',
		borderWidth: 2,
	  }
	];
  
	public chartOptions: any = {
	  responsive: true
	};
	public chartClicked(e: any): void { }
	public chartHovered(e: any): void { }

// End chart	

	elements: any = [];
    headElements = ['ID', 'First', 'Last', 'Handle'];

	constructor() {}

	ngOnInit() {
		for (let i = 1; i <= 15; i++) {
			this.elements.push({
			  id: i, first: 'User ' + i, last: 'Name ' + i, handle:
				'Handle ' + i
			});
		}
	}
}
