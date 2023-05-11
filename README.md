# tryout-node-rough-user-session

An idea for an API server which uses request headers to roughly (and quickly) infer user sessions

∅&nbsp; __Version:__
    0.0.1  
∅&nbsp; __Repo:__
    <https://github.com/richplastow/tryout-node-rough-user-session>  
∅&nbsp; __AWS Billing Dashboard:__
    <https://eu-central-1.console.aws.amazon.com/billing>  
∅&nbsp; __App Runner Console:__
    <https://eu-central-1.console.aws.amazon.com/apprunner>  

## IMPORTANT NOTE

_Potentially insecure! This repo is only intended as a proof-of-concept._

## Try it out locally

### __Start the server:__
Use ctrl-c to stop the server, afterwards.

```sh
npm start
```

### __Health check:__
The first health check is logged to the server, and every 1000th after that.

```sh
curl http://localhost:1234/
# ok!
```
