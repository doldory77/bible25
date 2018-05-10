import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class GlobalVarsProvider {

  _vars: Map<string, any>;

  constructor(private storage: Storage) {
    this._vars = new Map();

    // 초기화
    this.getValueWithStorage('fontSize')
      .then(value => {
        console.log(value);
        if (!value) {
          this.addValueWithStorage('fontSize', 1.0);
        }
      }, error => {console.error(error)});

    this.getValueWithStorage('backgroundColor')
      .then(value => {
        if (!value) {
          this.addValueWithStorage('backgroundColor', '#FFFFFF');
        }
      }, error => {console.error(error)});

    this.getValueWithStorage('fontColor')
      .then(value => {
        if (!value) {
          this.addValueWithStorage('fontColor', '#000000');
        }
      }, error => {console.error(error)});

    this.getValueWithStorage('pushYn')
      .then(value => {
        if (value == null || value == undefined) {
          this.addValueWithStorage('pushYn', true);
        }
      }, error => {console.error(error)});
    
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
