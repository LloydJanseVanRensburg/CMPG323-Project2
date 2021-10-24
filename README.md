# CMPG323 PROJECT 2

#### TECHNOLOGIES

| Frontend   | Backend      | Hosting & Storage | Additional Services |
| ---------- | ------------ | ----------------- | ------------------- |
| React      | NodeJs       | Linode            | AWS SES             |
| Ionic      | ExpressJS    | AWS S3            | Swagger             |
| TypeScript | TypeScript   |                   |                     |
| CSS        | MongoDB |                   |                     |


# Getting Started

!! Account needed for following services: AWS, Linode, MongoDB Atlas !!

`cd ./backend && npm i`
`cd ./frontend && npm i`

> Please make sure to add .env file in frontend root dir with flag
> `SKIP_PREFLIGHT_CHECK=true`

#### Env Variables Required In App Backend

```
PORT=

MONGO_CONNECT_URI=
MONGO_USER=
MONGO_PASSWORD=

JWT_SECRET=

AWS_REGION=

AWS_S3_ACCESS_KEY=
AWS_S3_SECRET_KEY=
AWS_S3_BUCKET=

AWS_SES_ACCESS_KEY=
AWS_SES_SECRET_KEY=

FRONTEND_URL=
```
