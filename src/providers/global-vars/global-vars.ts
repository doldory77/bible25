import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class GlobalVarsProvider {

  _vars: Map<string, any>;

  constructor(private storage: Storage) {
    this._vars = new Map();
  }

  varExist(varName: string): boolean {
    return this._vars.has(varName);
  }

  getValue(varName: string): any {
    return this._vars.get(varName);
  }

  addValue(varName: string, value: any) {
    this._vars.set(varName, value);
  }

  addValueWithStorage(varName: string, value: any) {
    this.storage.set(varName, value);
  }

  getValueWithStorage(varName: string): Promise<any> {
    return this.storage.get(varName);
  }

}
