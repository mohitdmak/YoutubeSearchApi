# YoutubeSearchApi

[![Node.js CI](https://github.com/mohitdmak/YoutubeSearchApi/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/mohitdmak/YoutubeSearchApi/actions/workflows/node.js.yml)

## API Paths
> After following the installation process below and starting project, the api shall be listening for requests at port 3000.

- /
  > Home path, app shall respond with a simple json acknowledgement

- /search/< query >
  > Insert query which you want your Data API v3 to send results for, which will be sorted by latest uploaded and return max responses of 2
 ( hard coded, can change at ./controllers/searchController.js)

- /find/< query >
  > Filter responses by video's title or description or both.
  Server expects them to be values of keys:
  "title"
  "description"
  in url query strings.

  > The < query > must have been searched for before in order to filter by title or description.

## To start, 

<details>
<summary> Create a Mongo Atlas Connection URI</summary>
<br>
- Login to Mongo Atlas
- Create a project and build new cluster ( it provides a free sandbox )
- Create Database users and secure network access to your machine's IP only
- Create a database which has 2 collections:
  - videos
  - searches
- Obtain a connection uri for node version > 14
</details>

<details>
<summary> Get a Youtube Data API V3 key</summary>
<br>

- Visit Google Api Console, https://console.cloud.google.com/

- Create a new project and enable the Yt Data API v3 at https://console.cloud.google.com/apis/api/youtube.googleapis.com

- Create Credentials and secure the key to allow access to only the created api, and download credentials into your project folder

- Preferrably procure multiple keys as the project will automatically cycles through keys, as their request quotas get exhausted.
</details>

### Get the project in your local machine
- Fork the project
- Clone by following on terminal at preferred directory

```
git clone https://github.com/<Your_Username>/YoutubeSearchApi.git
```

### Setup the config folder

- Copy and export the Mongo connection uri into a file at 
./config/mongouri.js 
from your project.

- Copy and export (as an array) the set of all api keys at 
./config/apiKey.js
from your project. 

### Containerise app
- This requires your machine to have Docker runtime installed. If it isnt already install by refering these
  - (Mac OS) https://docs.docker.com/docker-for-mac/install/
(Windows) https://docs.docker.com/docker-for-windows/install/
(Linux) https://docs.docker.com/engine/install/ (Browse by distributions)

  - Further Install docker compose
  https://docs.docker.com/compose/install/

- Create docker image and containers 
   - You may need to create a user group or else run as sudo 
```
docker-compose up --build
```
<br>

#### You can run app without docker in case of issues by:

- Initiating project with npm pm
```
npm init -y 
```
- Installing dependancies
```
npm install i
```
- Test Npm Script:
```
npm run test
```
- Starting Project
```
npm run start
```

