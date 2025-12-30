// HomieBites seed script
import dotenv from 'dotenv';
import { join } from 'path';
import connectDB from '../config/database.js';
import Menu from '../models/Menu.js';
import Offer from '../models/Offers.js';

dotenv.config({ path: join(process.cwd(), '.env') });

const parseDate = (str) => {
  if (!str) return null;
  // Accept format '09-Jul-2027' or '9-Jul-2027'
  const parts = String(str).trim().split('-');
  if (parts.length !== 3) return new Date(str);
  const [dd, mmm, yyyy] = parts;
  const monthNames = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const m = monthNames[mmm.substr(0, 3)];
  if (m === undefined) return new Date(str);
  return new Date(parseInt(yyyy, 10), m, parseInt(dd, 10));
};

const sampleMenu = [
  {
    id: 1,
    category: 'Full Tiffin',
    icon: 'fa-star',
    tag: 'Best Seller',
    description: 'Gravy Sabji + Dry Sabji + 4 Rotis + Rice',
    items: [
      { id: 1, name: 'Thali Plastic (Classic)', price: 120 },
      { id: 10, name: 'Tiffin Steel (Zambo)', price: 150 },
    ],
  },
  {
    id: 2,
    category: 'Rotis & Parathas',
    icon: 'fa-bread-slice',
    items: [
      { id: 1, name: 'Plain Roti', price: 10 },
      { id: 2, name: 'Roti with Ghee', price: 12 },
    ],
  },
];

const sampleOffers = [
  {
    title: 'Welcome Offer',
    description: 'Get 20% off on your first order',
    discount: '20%',
    badge: 'NEW',
    terms: ['One per customer'],
    startDate: '01-Jan-2025',
    endDate: '31-Dec-2027',
    whatsappMessage: 'Use code WELCOME',
    ctaText: 'Get This Deal',
    isActive: true,
  },
  {
    title: 'Festive Special',
    description: 'Flat ₹50 off on orders above ₹300',
    discount: '₹50',
    badge: 'FESTIVE',
    terms: ['Valid during festival period'],
    startDate: '01-Jul-2027',
    endDate: '31-Jul-2027',
    whatsappMessage: 'Celebrate with HomieBites',
    ctaText: 'Grab Offer',
    isActive: true,
  },
];

const run = async () => {
  try {
    await connectDB();
    console.log('Seeding menu...');
    await Menu.findOneAndUpdate(
      { key: 'default' },
      { data: sampleMenu, updatedAt: new Date() },
      { upsert: true }
    );

    console.log('Seeding offers...');
    // Remove old offers and insert samples
    await Offer.deleteMany({});
    const offersToInsert = sampleOffers.map((o) => ({
      ...o,
      startDate: parseDate(o.startDate),
      endDate: parseDate(o.endDate),
    }));
    await Offer.insertMany(offersToInsert);

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

run();
