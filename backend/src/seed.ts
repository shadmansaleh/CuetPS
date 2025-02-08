import { connectDB } from "./config/db";
import User from "./models/User";
import Photo from "./models/Photo";
import Exhibition from "./models/Exhibition";
import { randomInt } from "./utils/utils";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

const users = [
  {
    name: "admin",
    email: "admin@mail.com",
    password: "admin",
    role: "admin",
  },
  {
    name: "user",
    email: "user@mail.com",
    password: "pass",
    role: "user",
  },
  {
    name: "shadman",
    email: "shadman@mail.com",
    password: "pass",
    role: "user",
  },
];

let photos = [
  {
    title: "Mountain Landscape",
    caption: "Beautiful mountain view at sunset",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    aspect_ratio: 1.5,
    user: "",
    votes: [],
  },
  {
    title: "Ocean View",
    caption: "A serene view of the ocean with waves crashing on the shore",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    aspect_ratio: 1.5,
    user: "",
    votes: [],
  },
  {
    title: "Forest Path",
    caption: "A peaceful forest path surrounded by tall trees",
    image_url: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    aspect_ratio: 0.7,
    user_id: "3",
    votes: [],
  },
  {
    title: "City Skyline",
    caption: "A vibrant city skyline during sunset",
    image_url: "https://images.unsplash.com/photo-1668786418135-6227c68c8391",
    aspect_ratio: 1.33,
    user_id: "4",
    votes: [],
  },
  {
    title: "Desert Dunes",
    caption: "Golden sand dunes under a clear sky",
    image_url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
    aspect_ratio: 1.5,
    user_id: "6",
    votes: [],
  },
  {
    title: "Tropical Beach",
    caption: "Crystal clear water and white sand beach with palm trees",
    image_url: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    aspect_ratio: 0.7,
    user_id: "7",
    votes: [],
  },
  {
    title: "Aurora Borealis",
    caption: "Northern lights over a snowy landscape",
    image_url: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    aspect_ratio: 0.7,
    user_id: "8",
    votes: [],
  },
  {
    title: "Countryside View",
    caption: "Rolling hills and meadows under a cloudy sky",
    image_url: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    aspect_ratio: 1.7,
    user_id: "9",
    votes: [],
  },
  {
    title: "Rainforest Canopy",
    caption: "Lush green rainforest trees viewed from above",
    image_url: "https://images.unsplash.com/photo-1444044205806-38f3ed106c10",
    aspect_ratio: 1.5,
    user_id: "10",
    votes: [],
  },
];

let exhibitions = [
  {
    title: "Nature  Photography",
    description: "A collection of stunning nature photography",
    thumbnail_url:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    start_date: new Date(2024, 4, 23),
    end_date: new Date(2024, 5, 2),
    status: "active",
    photos: Array(),
  },
  {
    title: "Cityscapes",
    description: "A collection of cityscape photography",
    thumbnail_url:
      "https://images.unsplash.com/photo-1668786418135-6227c68c8391",
    start_date: new Date(2023, 8, 12),
    end_date: new Date(2023, 8, 22),
    status: "active",
    photos: Array(),
  },
  {
    title: "Landscapes",
    description: "A collection of landscape photography",
    thumbnail_url:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    start_date: new Date(2024, 4, 23),
    end_date: new Date(2024, 5, 2),
    status: "past",
    photos: Array(),
  },
  {
    title: "Wildlife",
    description: "A collection of wildlife photography",
    thumbnail_url:
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    start_date: new Date(2024, 2, 12),
    end_date: new Date(2024, 3, 2),
    status: "past",
    photos: Array(),
  },
  {
    title: "Abstract",
    description: "A collection of abstract photography",
    thumbnail_url:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
    start_date: new Date(2022, 6, 10),
    end_date: new Date(2022, 6, 12),
    status: "upcoming",
    photos: Array(),
  },
];

async function seed() {
  await connectDB();
  users.forEach((user) => {
    user.password = bcrypt.hashSync(user.password, 10);
  });
  await User.deleteMany({});
  await User.insertMany(users);
  const user = await User.findOne({ email: "shadman@mail.com" });
  photos.forEach((photo) => {
    photo.user = user?._id;
  });
  await Photo.deleteMany({});
  const photos_doc = await Photo.insertMany(photos);

  await Exhibition.deleteMany({});

  for (let i = 0; i < 100; i++) {
    const exhibition = exhibitions[randomInt() % exhibitions.length];
    const photo = photos_doc[i % photos_doc.length];
    exhibition.photos.push({ image: photo, selected: true });
  }

  await Exhibition.insertMany(exhibitions);

  console.log("Data imported");
}

if (require.main === module) {
  dotenv.config();
  connectDB();
  seed()
    .catch(console.error)
    .finally(() => process.exit());
}
