//provider api

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PostProvider {
	// server: string = "http://127.0.0.1/maps_api/index.php/mymaps/"
	// server: string = "http://160.202.43.61:7878/maps_api/index.php/mymaps/"
	// server: string = "http://mobile.vci.co.id:88/maps_api/index.php/mymaps/"
	// server: string = "http://192.168.0.137:8080/maps_api/index.php/mymaps/"
	// server: string = "http://192.168.0.137/maps_api/index.php/mymaps/"
	// server: string = "http://192.168.0.8/maps_api/index.php/mymaps/"
	server: string = "http://maps.vci.co.id/maps_api/index.php/mymaps/"

	constructor(public http: Http) {

	}

	postData(body, file) {

		console.log(JSON.stringify(body));
		//let type = "application/json; charset=UTF-8";
		let type = "text/plain";
		let headers = new Headers({ 'Content-Type': type });
		let options = new RequestOptions({ headers: headers });

		return this.http.post(this.server + file, JSON.stringify(body), options)
			.map(res => res.json());

	}








}