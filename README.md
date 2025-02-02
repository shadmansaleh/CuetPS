# Cuet Photographic Society

A place to share your sight with the world

### Requirements:

- NodeJS
- MongoDB server

### Setup development environment

#### Without docker:

1. Clone the repo

```sh
git clone https://github.com/shadmansaleh/Cuet-Photographic-Society
```

2. Run setup (One-Time):
   This will install dependencies and setup required files.

```sh
npm run setup
```

3. Configure setup (One-Time):
   You'll need to fill out `backend/.env` and `frontend/.env.local` with your information.
   Read the comments in those files to see what you need.

4. Insert seed data in database (One-time):

```sh
npm run seed
```

5. Start server:
   This will run the react frontend in port 3000 and backend on port 5000.
   You can access the site with [localhost:3000](http://localhost:3000)

```sh
npm run dev
```

#### With docker

1. Clone the repo

```sh
git clone https://github.com/shadmansaleh/Cuet-Photographic-Society
```

2. Run the docker image

```sh
docker compose up -d
```

4. Insert seed data in database (One-time):

```sh
npm run seed
```

5. Visit the website

[http://localhost:8080](http://localhost:8080)


### Demo

You can check it out at [deployment](https://cuet-ps-frontend-tau.vercel.app/).

### Screenshots


### Credits

Web project for CSE-356 (Software Engineering Sessional)

- [Shadman Saleh](https://github.com/shadmansaleh) (shadmansaleh3@gmail.com)
- [Adiba Fairooz Chowdhury](https://github.com/AdibAFC) (adibafairoozchowdhury@gmail.com)
- [Pritha Saha](https://github.com/PrithS24) (prithasaha2022@gmail.com)
