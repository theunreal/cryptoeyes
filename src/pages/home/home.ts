import {Component, HostListener} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {CryptoProvider} from "../../providers/crypto/crypto";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/startWith';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{

  coins = [];
  subscription: Subscription;
  subStrings = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '5~CCCAGG~DASH~USD',
    '5~CCCAGG~LTC~USD', '5~CCCAGG~ZEC~USD', '5~CCCAGG~XRP~USD'];
  @HostListener('window:beforeunload')
  doSomething() {
    this.stopSub();
  }

  constructor(public navCtrl: NavController, public cryptoService: CryptoProvider) {

  }

  ionViewWillEnter() {
    this.subscription = Observable
      .interval(15000)
      .startWith(0)
      .subscribe(() => {
        this.cryptoService.getCryptos()
          .subscribe((data: any[]) => {
            this.coins = data;
          });
      });

    /**
     * TODO: Update to polling
     this.subscription = this.cryptoService.getCryptoPrice(this.subStrings)
     .subscribe();
     */

  }

  stopSub() {
    this.subscription.unsubscribe();
    // this.cryptoService.stopSub(this.subStrings);
  }

  ionViewWillLeave() {
    this.stopSub();
  }

  viewCurrency(currency) {
    this.navCtrl.push('CurrencyPage', {
      currency: currency
    });
  }

}
