# SailsTestSampler

## How to exec

    npm install
    npm test

## About APIs on this app

At first, please launch the app by ```sails lift```

### Register A User

|URL|header|data to send|
|:---|:---|:---|
|[POST]http://localhost:1337/user |Content-Type:application/json|{"name":"hoge"}|

### Get A User

|URL|header|data to get|
|:---|:---|:---|
|[GET]http://localhost:1337/user |Content-Type:application/json|[<br>{<br>"name": "hoge",<br>"createdAt": "2015-10-20T14:01:56.509Z",<br>"updatedAt": "2015-10-20T14:01:56.509Z",<br>"id": 3<br>}<br>]|
