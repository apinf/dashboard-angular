import { Meteor } from 'meteor/meteor';

import { Client as ESClient } from 'elasticsearch';
import * as moment from 'moment';

import { QueryOption } from '../../../imports/models/query-option';

Meteor.methods({
  // published messages, group by clientid, gives published clients
  getPublishedMessages () {
    return {
      "query": {
        "term": { "event": "message_published" }
      },
      "aggs": {
        "group_by_users": {
          "terms": {
            "field": "from.client_id.keyword"
          }
        }
      }
    }
  },
  // delivered messages, group by clientid, gives published clients
  getDeliveredMessages () {
    return {
      "query": {
        "term": { "event": "message_delivered" }
      },
      "aggs": {
        "group_by_client": {
          "terms": {
            "field": "client_id.keyword"
          }
        }
      }
    }
  },
  // group by clientid gives subscribed clients.
  getSubscribedClients () {
    return {
      "query": {
        "term": {
          "event": "client_subscribe"
        }
      },
      "aggs": {
        "group_by_client": {
          "terms": {
            "field": "client_id.keyword"
          }
        }
      }
    }
  },
  // count of unique clientids in message_published
  getPublishedClients () {
    // Call getPublishedMessages

    // doc_count of buckets -- published clients
  },
  getHistogramData (queryOption: QueryOption) {
    return {
      query: {
        bool: {
          must: [
            {
              term: {
                event: queryOption.eventType
              }
            },
            {
              range: {
                timestamp: {
                  gte: queryOption.from,
                  lte: queryOption.to,
                },
              },
            }
          ],
        }
      },
      aggs: {
        data_over_time: {
          date_histogram: {
            field: 'timestamp',
            interval: 'hour',
          },
        }
      }
    }
  },
  sendElastisticsearchRequest (queryOption: QueryOption) {
    const host = 'http://84.20.148.204:9200';

    const body = Meteor.call('getHistogramData', queryOption);

    const query = {
      index: 'mqtt',
      size: 0,
      body,
    };

    // Initialize Elasticsearch client, using provided host value
    const esClient = new ESClient({ host });

    return esClient.search(query);
  },
  unpromisify () {
    Meteor.call('sendElastisticsearchRequest', (error, result) => {
      console.log('error', error);

      if (result) {
        const data = result.aggregations.data_over_time.buckets;

        data.forEach(bucket => {
          console.log({ count: bucket.count, key_as_string: moment(bucket.key).format('LLL') })
        });
        console.log('result', );
      }

    });
  },
});

