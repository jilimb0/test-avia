const axios = require('axios');

const ROOT_URL = 'https://front-test.beta.aviasales.ru'

const SEARCH_ID_URL = generateUrl('search');
const TICKETS_URL = generateUrl('tickets');

function generateUrl(path) {
  return [ROOT_URL, path].join('/')
}

async function getSearchId() {
  console.log('Getting search ID:', SEARCH_ID_URL);

  const { data: { searchId } } = await axios.get(SEARCH_ID_URL);
  
  console.log('Got search ID:', searchId);

  return searchId
}

async function getTickets(searchId) {
  const ticketsUrl = [TICKETS_URL, `searchId=${searchId}`].join('?');
  
  console.log('Getting tickets from', ticketsUrl);

  return await axios.get(ticketsUrl)
    .then(({ data }) => data)
    .catch((error) => console.error('Error getting tickets:', error.response.status));
}

async function main() {
  const searchId = await getSearchId();

  let requestCount = 1;
  const ticketsList = [];

  while (true) {  
    console.log('Getting tickets, request count:', requestCount);

    const { stop, tickets } = await getTickets(searchId)

    requestCount++;

    console.log(`Got ${tickets.length} tickets, stop:`, stop);

    if (stop) {
      break
    }

    ticketsList.push(...tickets);

    stopPerformingRequests = stop
  }

  console.log('Got all tickets!', ticketsList.length)
}

main();