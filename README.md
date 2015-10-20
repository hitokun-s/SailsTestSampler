# SailsTestSampler

##API

###ユーザを登録

|URL|header|送信データ例|
|:---|:---|:---|
|[POST]http://localhost:1337/user |Content-Type:application/json|{"name":"hoge"}|

###ユーザを取得

|URL|header|受信データ例|
|:---|:---|:---|
|[GET]http://localhost:1337/user |Content-Type:application/json|[{
                                                                        "name": "hoge",
                                                                        "createdAt": "2015-10-20T14:01:56.509Z",
                                                                        "updatedAt": "2015-10-20T14:01:56.509Z",
                                                                        "id": 3
                                                                    }]
|
