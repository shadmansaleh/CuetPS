# Cuet Photographic Society

<img width="1857" height="984" alt="Screenshot_20260416_102101" src="https://github.com/user-attachments/assets/61e59323-3943-4237-94f5-3c56a62339d0" />


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

| | |
| :---: | :---: |
| **Landing Page** | **Gallery** |
| <img src="https://github.com/user-attachments/assets/c2b1e176-a765-4fbf-bd75-1bd38240acb5" width="100%" /> | <img src="https://github.com/user-attachments/assets/cb7d5d83-7258-40d2-8ce8-bee4c7fa4018" width="100%" /> |
| **Exhibitions** | **Exhibition Details** |
| <img src="https://github.com/user-attachments/assets/62900c9f-648c-489e-b32d-063553fe5507" width="100%" /> | <img src="https://github.com/user-attachments/assets/8f424bc3-7f56-44db-aa04-5d7fe7da2cb3" width="100%" /> |
| **Submit Photo** | **About Us** |
| <img src="https://github.com/user-attachments/assets/9fed45ff-846f-49ea-bb3e-e9865d7b8d5f" width="100%" /> | <img src="https://github.com/user-attachments/assets/6b1c9252-608f-4cf3-8d9f-a37060c3afd3" width="100%" /> |
| **User Profile** | **Admin Dashboard** |
| <img src="https://github.com/user-attachments/assets/de34e0c8-023d-41d2-bcd0-871947d04551" width="100%" /> | <img src="https://github.com/user-attachments/assets/0f918f1d-7d48-4ea5-af5d-1e2781a430f5" width="100%" /> |
| **Photo Management** | **Exhibition Management** |
| <img src="https://github.com/user-attachments/assets/45fb9557-2a66-477b-8fe0-eff7de475f97" width="100%" /> | <img src="https://github.com/user-attachments/assets/8f380c9f-feaf-4297-ad49-e6fd764adec3" width="100%" /> |

### Credits

Web project for CSE-356 (Software Engineering Sessional)

- [Shadman Saleh](https://github.com/shadmansaleh) (shadmansaleh3@gmail.com)
- [Adiba Fairooz Chowdhury](https://github.com/AdibAFC) (adibafairoozchowdhury@gmail.com)
- [Pritha Saha](https://github.com/PrithS24) (prithasaha2022@gmail.com)
