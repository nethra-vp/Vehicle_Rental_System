require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI; 


const VehicleSchema = new mongoose.Schema({
  name: String,
  brand: String,
  pricePerDay: Number,
  fuelType: String,
  seatingCapacity: Number,
  location: String,
  images: [String],
}, { timestamps: true });

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);

const sampleVehicles = [
  {
    name: "Innova Crysta",
    brand: "Toyota",
    pricePerDay: 5000,
    fuelType: "Diesel",
    seatingCapacity: 7,
    location: "Bangalore",
    images: ["https://fortune-toyota.com/wp-content/uploads/2025/07/toyota-innova-copy.webp"]
  },
  {
    name: "Fortuner",
    brand: "Toyota",
    pricePerDay: 5500,
    fuelType: "Diesel",
    seatingCapacity: 7,
    location: "Mangalore",
    images: ["https://www.deccanchronicle.com/h-upload/2024/04/22/1085406-fortunerleaderwhite.webp"]
  },
  {
    name: "Thar",
    brand: "Mahindra",
    pricePerDay: 2500,
    fuelType: "Petrol",
    seatingCapacity: 4,
    location: "Bangalore",
    images: ["https://imgd.aeplcdn.com/1920x1080/n/cw/ec/204996/thar-2025-exterior-right-front-three-quarter-5.png?isig=0&q=80&q=80"]
  },
  {
    name: "Innova Crysta",
    brand: "Toyota",
    pricePerDay: 5000,
    fuelType: "Diesel",
    seatingCapacity: 7,
    location: "Mangalore",
    images: ["https://fortune-toyota.com/wp-content/uploads/2025/07/toyota-innova-copy.webp"]
  },
  {
    name: "Creta",
    brand: "Hyundai",
    pricePerDay: 1800,
    fuelType: "Diesel",
    seatingCapacity: 5,
    location: "Mangalore",
    images: ["https://stimg.cardekho.com/images/carexteriorimages/630x420/Hyundai/Creta/8667/1755765115423/front-left-side-47.jpg?imwidth=420&impolicy=resize"]
  }
];

async function seed() {
  if (!MONGODB_URI) {
    console.log("MONGODB_URI not found in .env.local");
    return;
  }
  await mongoose.connect(MONGODB_URI);
  await Vehicle.deleteMany({});
  await Vehicle.insertMany(sampleVehicles);
  console.log("Database seeded successfully!");
  process.exit();
}

seed();
