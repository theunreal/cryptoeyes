import {Component, HostListener, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CryptoProvider} from "../../providers/crypto/crypto";
import {Subscription} from "rxjs/Subscription";
import {Title} from '@angular/platform-browser';
import { Platform } from 'ionic-angular';
import {Chart, StockChart} from "angular-highcharts";

@IonicPage({
  segment: 'currency/:currency',
  defaultHistory: ['HomePage'],

})

@Component({
  selector: 'page-currency',
  templateUrl: 'currency.html',
})
export class CurrencyPage {

  coin;
  subString;
  subscription: Subscription;
  yesterdayRecord;
  graphType = 'day';
  @ViewChild('dayChartRef') dayChartRef;
  chartLoaded = false;
  viewTypes = [
    {
      label: 'Day',
      key: 'day'
    },
    {
      label: 'Hour',
      key: 'hour'
    },
    {
      label: 'Real Time',
      key: 'realtime'
    }
  ];

  realTimeChartData = new StockChart({series: [{name: 'Price (USD)', data: []}]});
  dayChartData = new StockChart({series: [{name: 'Price (USD)', data: []}]});
  hourChartData = new StockChart({series: [{name: 'Price (USD)', data: []}]});

  @HostListener('window:beforeunload')
  doSomething() {
    this.stopSub();
  }


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public cryptoService: CryptoProvider, public alertCtrl: AlertController,
              title: Title, platform: Platform) {
    const currency = this.navParams.get('currency');
    title.setTitle(`${currency} - Real time prices and stats`);
    /*
    const metaContent = `Get the latest ${currency} price analytics in real time`;
    meta.addTag({property: 'description', content: metaContent});
    meta.addTag({property: 'og:title', content: `${currency} - Real time prices and stats`});
    // Facebook meta test
    meta.addTag({property: 'og:url', content: window.location.href});
    meta.addTag({property: 'og:type', content: 'website'});
    meta.addTag({property: 'og:image', content: 'https://www.cryptoeyes.net/assets/imgs/sce.jpg'});
    meta.addTag({property: 'og:image:secure_url', content: 'https://www.cryptoeyes.net/assets/imgs/sce.jpg'});
  */
  }

  ionViewDidLoad() {
    const currency = this.navParams.get('currency');
    this.cryptoService.getCryptoData(currency)
      .subscribe((cryptoData) => {
        this.coin = cryptoData;
        if (this.coin.dayHistory.length) {
          this.yesterdayRecord = this.coin.dayHistory[this.coin.dayHistory.length-1];
          this.coin.yesterdayTrend = (((this.yesterdayRecord.close - this.yesterdayRecord.open) / this.yesterdayRecord.open) * 100);
          this.coin.yesterdayTrendRaw = (this.yesterdayRecord.close - this.yesterdayRecord.open);

          this.coin.currentTrend = (((this.coin.price - this.yesterdayRecord.close) / this.yesterdayRecord.close) * 100);
          this.coin.currentTrendRaw = Math.abs(((this.coin.price - this.yesterdayRecord.close)));
        }
        setTimeout(() => {
          this.updateChartData(this.coin.dayHistory, this.dayChartData);
          this.getRealTimeData();
        }, 1000);
        });
  }

  updateChartData(data, chart) {
    let dataArray = [];
    data.forEach((entry) => {
      const newItem = [entry.time*1000, entry.close];
      dataArray.push(newItem);
    });
    chart.ref.addSeries({
      data: dataArray,
      name: 'Price (USD)'
    });
    this.chartLoaded = true;
  }

  addPoint(time, close) {
    const newItem = [];
    newItem.push(time, close);
    this.realTimeChartData.ref.series[0].addPoint(newItem);
  }

  updateChart ($event) {
    switch ($event.value) {
      case 'hour':
        if (!this.hourChartData.ref.series[0].length) {
          setTimeout(() => {
            this.updateChartData(this.coin.hourHistory, this.hourChartData);
          }, 1000);
          break;
        }
    }
  }

  getRealTimeData() {
    this.subString = [`5~CCCAGG~${this.coin.short_name}~USD`];
    this.subscription = this.cryptoService.getCryptoPrice(this.subString)
      .subscribe((data: any) => {
        if (this.yesterdayRecord && data && !isNaN(data)) {
          this.coin.currentTrend = (((this.cryptoService.realTimePrices[this.coin.short_name] - this.yesterdayRecord.close) / this.yesterdayRecord.close) * 100);
          this.coin.currentTrendRaw = Math.abs(((this.cryptoService.realTimePrices[this.coin.short_name] - this.yesterdayRecord.close)));

          if (this.graphType === 'realtime') {
            this.addPoint(Date.now(), parseFloat(data));
          }
        }
      });
  }

  viewMore(type) {
    let label;
    let title;
    if (!this.cryptoService.realTimePrices[this.coin.short_name]) {
      this.cryptoService.realTimePrices[this.coin.short_name] = this.coin.price;
    }
    switch (type) {
      case 'currentPrice':
        title = 'Real Time Price';
        label = 'Based on average price from more than 50 different markets';
        break;
      case 'currentTrend':
        title = 'Now vs. yesterday';
        label = `Now: <b>${this.cryptoService.realTimePrices[this.coin.short_name]}$</b><br/>
        Yesterday market close: <b>${this.yesterdayRecord.close}$</b>`;
        break;
        case 'yesterdayTrend':
        title = 'Yesterday open/close change';
        label = `Open: <b>${this.yesterdayRecord.open}$</b><br/>
        Close: <b>${this.yesterdayRecord.close}$</b>`;
        break;
    }
    this.alertCtrl.create({
      title: title,
      subTitle: label,
      buttons: ['OK']
    }).present();
  }

  stopSub() {
      this.subscription.unsubscribe();
      this.cryptoService.stopSub(this.subString);
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.stopSub();
    }
  }


}
