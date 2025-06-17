import { Injectable } from '@angular/core';
import { NfceRequestDTO } from 'src/app/types/nfceTypes/nfce';

const Nfce_key = 'nfce';

@Injectable({
  providedIn: 'root',
})
export class NfceLocalStorageService {
  constructor() {}

  save(nfce: NfceRequestDTO): void {
    const nfceJson = JSON.stringify(nfce);
    localStorage.setItem(Nfce_key, nfceJson);
  }

  get(): NfceRequestDTO | null {
    const nfceJson = localStorage.getItem(Nfce_key);
    if (nfceJson) {
      return JSON.parse(nfceJson) as NfceRequestDTO;
    }
    return null;
  }
  clear(): void {
    localStorage.removeItem(Nfce_key);
  }
  update(nfce: NfceRequestDTO): void {
    this.save(nfce);
  }
}
