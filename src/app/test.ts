//import { FetchAutostoreMessageGQL } from './graphql/autostore.graphql-gen';
//import { Subscription } from 'rxjs';

let _fetchMessage = require('FetchAutostoreMessageGQL');
const fetchMessageSubscription = require('Subscription');

fetchMessageSubscription.add(
  _fetchMessage
    .fetch({ maxRetries: 3 }, { fetchPolicy: 'network-only' })
    .subscribe({
      next: (res) => {
        console.log(res.data.fetchAutostoreMessage[0].TypeID);
      },
    })
);

// let axios = require('axios');

// axios('https://api.publicapis.org/entries', {
//   method: 'get',
//   timeout: 1000,
// }).then((response) => console.log('boom - ' + JSON.stringify(response.data)));
