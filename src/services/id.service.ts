import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdService {
  getId(size = 10): string {
    let ret = '';
    while (size = size - 1) {
      ret += String.fromCharCode(Math.round(Math.random() * 25 + 97));
    }
    return ret;
  }
  constructor() { }
}
