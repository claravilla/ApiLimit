# API Rate Limit

Basic Express Node.js app with a middleware to enforces rate limiting on API requests.  
[Link](https://apilimit.onrender.com/home)

**Routes**

- /home
- /articles
- /contacts
- /events

### How the middleware works

There is a rate limit based on endpoint and authentication with an API key.
The limit is based on IP, authentication status and endpoints. If the request passes the wrong API key the call is considered as anonymous.  
Every time there is a call to the server the following checks are performed:

- is there an IP address?
- does this route have rate limit?
- if so, how many calls from this address, with this authentication status, to this endpoints have been made in the time frame?

Based on that, the server returns a 200 or a 429 response.

The number of calls is stored in Redis, using data type Set. The timestamp is recorded in Epoch time in seconds.
To avoid filling up Redis with unused data, every time a query is performed, records with a timestamp older than the time frame are deleted.

The API limits are stored in the apiLimitConfig file. The numbers are low to enable manual testing.

### How to use the rate limit

If the app needs to enforce the rate limit, the middleware should be applied to the route in the index file and the rates should be added to the apiLimitConfig file.
If the middleware is applied to the route but not matching config is created, the middleware will let the call through instead of throwing an error.

**In this app**

- /home: middleware applied to the route and limit added to the apiLimitConfig file
- /articles: middleware applied to the route and limit added to the apiLimitConfig file
- /event: middleware applied to the route but no limit in the apiLimitConfig file
- /contacts: no middleware and no apiLimitConfig file

### Built with

- Express.js
- Redis
- Jest
