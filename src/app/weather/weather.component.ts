import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  weather: any = {};
  currentTime = '';
  username = 'Admin User';
  
  projects = [
    { name: 'Login App', jira: 'https://jira.company.com/login-app', jenkins: 'https://jenkins.company.com/login-app', sonar: 'https://sonar.company.com/login-app', coverage: '85%' },
    { name: 'Weather API', jira: 'https://jira.company.com/weather-api', jenkins: 'https://jenkins.company.com/weather-api', sonar: 'https://sonar.company.com/weather-api', coverage: '92%' },
    { name: 'User Service', jira: 'https://jira.company.com/user-service', jenkins: 'https://jenkins.company.com/user-service', sonar: 'https://sonar.company.com/user-service', coverage: '78%' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getWeatherData();
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    this.currentTime = new Date().toLocaleString();
  }

  getWeatherData() {
    const apiKey = 'demo-key';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Hyderabad,IN&appid=${apiKey}&units=metric`;
    
    this.http.get(url).subscribe({
      next: (data) => this.weather = data,
      error: () => this.weather = {
        name: 'Hyderabad',
        main: { temp: 28 },
        weather: [{ description: 'Clear sky' }],
        coord: { lat: 17.385, lon: 78.4867 }
      }
    });
  }
}
