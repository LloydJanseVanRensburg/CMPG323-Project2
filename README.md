# CMPG323 PROJECT 2

#### TECHNOLOGIES

| Frontend   | Backend      | Hosting & Storage | Additional Services |
| ---------- | ------------ | ----------------- | ------------------- |
| React      | NodeJs       | Linode            | AWS SES             |
| Ionic      | ExpressJS    | AWS S3            | Swagger             |
| TypeScript | TypeScript   |                   |                     |
| CSS        | Parse-Server |                   |                     |
|            | MongoDB      |                   |                     |

# Getting Started

!! You will need to have _AWS_ account and _ParseBack4App_ Account !!

`cd ./backend && npm i`
`cd ./frontend && npm i`

> Please make sure to add .env file in frontend root dir with flag
> `SKIP_PREFLIGHT_CHECK=true`

#### Env Variables Required In App Backend

```
PORT=

JWT_SECRET=

PARSE_APPID=
PARSE_JSAPIKEY=
PARSE_MASTERKEY=
PARSE_SERVERURL=

AWS_REGION=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_S3_BUCKET=

EMAIL_SERVICE=
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_FROM=
```
