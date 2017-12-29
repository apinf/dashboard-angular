import { Component, OnInit } from '@angular/core';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import * as moment from 'moment';

import { QueryOption } from '../../../../imports/models/query-option';

@Component({
  selector: 'overview-page',
  templateUrl: 'overview-page.html',
  styleUrls: ['overview-page.scss']
})
export class OverviewPageComponent implements OnInit {
  aggregatedData: any = [];
  queryOption: QueryOption = {
    from: 1513357200000,
    to: 1513432800000,
    eventType: 'message_published'
  };
  lastUpdatedTime: number;

  ngOnInit() {
    // window.moment = moment;
    this.sendRequest();
    // this.updateRequest();
  }

  sendRequest () {
    console.log('send request', this.queryOption)
    MeteorObservable.call('sendElastisticsearchRequest', this.queryOption)
      .subscribe((result) => {
        this.aggregatedData = result.aggregations.data_over_time.buckets;

        if (this.aggregatedData.length === 0) {
          this.aggregatedData.push({
            doc_count: 0,
            key: this.queryOption.from
          })
        }
        console.log(this.aggregatedData)

        this.lastUpdatedTime = this.queryOption.to;
    }, (error) => {
      console.log('error', error);

      throw new Meteor.Error(error.message);
    });
  }

  updateRequest () {
    setInterval(() => {
      console.log('lastUpdatedTime', this.lastUpdatedTime)

      this.queryOption.from = this.lastUpdatedTime;
      this.queryOption.to = moment(this.lastUpdatedTime).add(1, 'h').valueOf();
      this.sendRequest();
    }, 30000)

  }
}
