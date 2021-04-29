1

GET 
https://timetreeapp.com/oauth/authorize?client_id=H0EfvvLbY7ybac8tksh_GWHP97EiWigrsu-Mj64Qlh0&redirect_uri=https://master.d1skuzk79uqu7w.amplifyapp.com/&response_type=code&state=CSRF

Redirected to 

https://master.d1skuzk79uqu7w.amplifyapp.com/?code=cCCGZqCAcEvGZY_wNHdPi7Zu6BFcGwmCB7WfmYxzxus&state=CSRF

* code=cCCGZqCAcEvGZY_wNHdPi7Zu6BFcGwmCB7WfmYxzxus
* state=CSRF

2
POST https://timetreeapp.com/oauth/token

client_id:H0EfvvLbY7ybac8tksh_GWHP97EiWigrsu-Mj64Qlh0
client_secret:DzlijpyQRFUzIYh0u1SJhDY45_N01KwqAcVethRY934
redirect_uri:https://master.d1skuzk79uqu7w.amplifyapp.com/
code:cCCGZqCAcEvGZY_wNHdPi7Zu6BFcGwmCB7WfmYxzxus
grant_type:authorization_code

{
    "access_token": "rGIXyB8QkOjxZdhn27trv0vyooBiAxmHTt9ef7VNrvs",
    "token_type": "Bearer",
    "scope": "read:user read:calendar read:member read:event write:event write:comment",
    "created_at": 1619522623
}

# GET USER
https://timetreeapis.com/user

HEADER
Accept:application/vnd.timetree.v1+json
Authorization: Bearer rGIXyB8QkOjxZdhn27trv0vyooBiAxmHTt9ef7VNrvs


### https://timetreeapis.com/calendars

```
{
    "id": "GsOa8rj4s_Sh",
    "type": "calendar",
    "attributes": {
    "name": "A&I",
    ...
}

    "id": "CNxlp99GdMiB",
    "type": "calendar",
    "attributes": {
    "name": "Andre",


```

### GET /calendars/:calendar_id/upcoming_events

https://timetreeapis.com/calendars/GsOa8rj4s_Sh/upcoming_events
https://timetreeapis.com/calendars/CNxlp99GdMiB/upcoming_events
