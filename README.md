# API Rate Limit

Basic Express Node.js app with a middleware to enforces rate limiting on API requests.  
[Link](https://apilimit.onrender.com/home)

**Routes**

- /home
- /articles
- /contacts

### How it works

There is a rate limit based on endpoint and authentication with an API key.
The limit is based on IP, authentication status and endpoints.
Every time there is a call to the server the following checks are performed:

- is there an IP address?
- does this route have rate limit?
- if so, how many calls from this address, with this authentication status, to this endpoints have been made in the time frame?

Based on that, the server returns a response or a 429.

The middleware is only applied to /home and /articles in the main app. However the logic to check if the endpoints has limits in the config is still in place in case of misalignment between the route config and the api limit config.

The number of calls is stored in Redis, using data type Set. The timestamp is recorded in Epoch time in seconds.
To avoid filling up Redis with unused data, every time a query is performed, records with a timestamp older than the time frame are deleted.

The API limits are stored in a config file. The numbers are low to enable manual testing.

### Built with

- Express.js
- Redis
- Jest
