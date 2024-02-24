# API Rate Limit

Basic Express Node.js app with a middleware to enforces rate limiting on API requests.
[Link](https://apilimit.onrender.com/home)

**Routes**

- /articles
- /contacts

### How it works

There is a rate limit based on endpoint and authentication with an API key.
The limit is based on IP, authentication status and endpoints.
Every time there is a call to the server the following checks are performed:

- is there an IP address?
- does this route have rate limit?
- if so, how many calls from this address, with this authentication status, to this endpoints have been made?

Based on that, the server returns a response or a 429.

The number of calls is stored in Redis, using data type Set. The timestamp is recorded in Epoch time in seconds.
To avoid filling up Redis with meaningless data, every time a query is performed, records with a timestamp older than the time frame are deleted.

The API limits are stored in a config file. The numbers are low to enable manual testing.

### Built with

- Express.js
- Redis
- Jest
