import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pool-div',
  templateUrl: './pool-div.component.html',
  styleUrls: ['./pool-div.component.css']
})
export class PoolDivComponent implements OnInit {
  weather: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCurrentWeatherReport();
  }

  getCurrentWeatherReport() {
    const apiKey = 'your-api-key';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Hyderabad,IN&appid=${apiKey}&units=metric`;
    
    this.http.get(url).subscribe({
      next: (data) => this.weather = data,
      error: () => this.weather = { name: 'Hyderabad', main: { temp: 28 }, weather: [{ description: 'sunny' }] }
    });
  }
}
