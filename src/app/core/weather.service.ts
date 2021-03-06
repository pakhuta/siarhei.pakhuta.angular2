import { Injectable } from '@angular/core';
import { Http, Response, Request, URLSearchParams, RequestMethod, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs';

import { WeatherData, CityWeatherData, Coords, VARS } from '../shared';
import { LocationService } from './location.service';
import { LoggerService } from './logger.service';

@Injectable()
export class WeatherService {
    constructor(
        private http: Http,
        private locationService: LocationService,
        private loggerService: LoggerService
    ) {};

    // returned weather for @cityCount nearby cities
    getCitiesWeather(cityCount: number): Subject<WeatherData> {
        let citiesWeatherSubject = new Subject();
        this.locationService.getPosition()
            .subscribe(position => {
                this.getWeatherData(cityCount, position).subscribe(
                    weatherData => {
                        citiesWeatherSubject.next(weatherData);
                    }
                );
        });

        return citiesWeatherSubject;
    }

    // returned weather for @cityName
    getCityWeather(cityName: string): Observable<CityWeatherData> {
        let searchParams = new URLSearchParams();
        searchParams.append('q', cityName);
        searchParams.append('appid', VARS.weatherConfig.api_key);

        let requestOptions = new RequestOptions({
            url: VARS.weatherConfig.cityWeatherUrl,
            method: RequestMethod.Get,
            search: searchParams
        });

        return this.http.request(new Request(requestOptions))
            .map((response: Response) => response.json() as CityWeatherData);
    }

    getCityWeatherById(cityId: string): Observable<CityWeatherData> {
        let searchParams = new URLSearchParams();
        searchParams.append('id', cityId);
        searchParams.append('appid', VARS.weatherConfig.api_key);

        let requestOptions = new RequestOptions({
            url: VARS.weatherConfig.cityWeatherUrl,
            method: RequestMethod.Get,
            search: searchParams
        });

        return this.http.request(new Request(requestOptions))
            .map((response: Response) => response.json() as CityWeatherData);
    }

    private getWeatherData(cityCount: number = VARS.weatherConfig.cityCount, position: Coords): Subject<WeatherData> {
        let searchParams = new URLSearchParams();
        searchParams.append('lat', position.lat.toString());
        searchParams.append('lon', position.lng.toString());
        searchParams.append('cnt', cityCount.toString());
        searchParams.append('appid', VARS.weatherConfig.api_key);

        let requestOptions = new RequestOptions({
            url: VARS.weatherConfig.citiesWeatherUrl,
            method: RequestMethod.Get,
            search: searchParams
        });

        let weatherDataSubject = new Subject();

        this.loggerService.log(`Get weather data for ${cityCount} cities`);

        this.http.request(new Request(requestOptions))
            .catch(err => this.getMockWeather.bind(this))
            .map((response: Response) => response.json() as WeatherData)
            .subscribe(weatherData => weatherDataSubject.next(weatherData));

        // this.getMockWeather()
        //     .map((response: Response) => response.json() as WeatherData)
        //     .subscribe(weatherData => weatherDataSubject.next(weatherData));

        return weatherDataSubject;
    }

    private getMockWeather(): Observable<Response> {
        return this.http.get('./mock/mock-weather.json');
    }
}