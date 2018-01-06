import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/interval';
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class CryptoProvider {

  realTimePrices = {};
  subscription: Subscription;
  _usePolling = false;

  constructor(public http: HttpClient, private socket: Socket) {
    this.socket.fromEvent('disconnect')
      .subscribe(() => {
        this.usePolling = true;
      });
  }

  getCryptos() {
    return this.http.get('api/crypto/getCryptos');
  }

  getCryptoPrice(subStrings) {
    // if (!this.usePolling) {
    this.socket.emit('SubAdd', {subs: subStrings});
    return this.socket.fromEvent('m')
      .debounceTime(1000)
      .map(this.socketParser.bind(this));
    // }
  }

  socketParser(socketEntry) {
    const socketArr = socketEntry.split('~');
    if (socketArr[4] === '4' || !socketArr[5]) {
      return 0;
    }
    const price = parseFloat(socketArr[5]).toFixed(2);
    this.realTimePrices[socketArr[2]] = price;
    if (price) {
      return price;
    }
    return 0;
  }

  stopSub(subStrings) {
    console.log('SubRemove: ' + subStrings);
    this.socket.emit('SubRemove', { subs: subStrings});
    this.socket.disconnect();
    this.socket.connect();
  }

  getCryptoData(shortName) {
    return this.http.get('api/crypto/getCrypto/' + shortName);
  }

  get usePolling() {
    return this._usePolling;
  }
  set usePolling(usePolling: boolean) {
    this._usePolling = usePolling;
  }
}
