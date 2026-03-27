const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '/Users/ayushpandey/Desktop/RTE/server/.env' });

const State = require('/Users/ayushpandey/Desktop/RTE/server/src/models/State');

const DB = process.env.MONGODB_URI;

// 🎯 State List
const statesArray = [
  { name: 'Andhra Pradesh', region: 'South' },
  { name: 'Arunachal Pradesh', region: 'Northeast' },
  { name: 'Assam', region: 'Northeast' },
  { name: 'Bihar', region: 'East' },
  { name: 'Chhattisgarh', region: 'Central' },
  { name: 'Goa', region: 'West' },
  { name: 'Gujarat', region: 'West' },
  { name: 'Haryana', region: 'North' },
  { name: 'Himachal Pradesh', region: 'North' },
  { name: 'Jharkhand', region: 'East' },
  { name: 'Karnataka', region: 'South' },
  { name: 'Kerala', region: 'South' },
  { name: 'Madhya Pradesh', region: 'Central' },
  { name: 'Maharashtra', region: 'West' },
  { name: 'Manipur', region: 'Northeast' },
  { name: 'Meghalaya', region: 'Northeast' },
  { name: 'Mizoram', region: 'Northeast' },
  { name: 'Nagaland', region: 'Northeast' },
  { name: 'Odisha', region: 'East' }, // fixed name
  { name: 'Punjab', region: 'North' },
  { name: 'Rajasthan', region: 'North' },
  { name: 'Sikkim', region: 'Northeast' },
  { name: 'Tamil Nadu', region: 'South' },
  { name: 'Telangana', region: 'South' },
  { name: 'Tripura', region: 'Northeast' },
  { name: 'Uttar Pradesh', region: 'North' },
  { name: 'Uttarakhand', region: 'North' }, // fixed name
  { name: 'West Bengal', region: 'East' },
  { name: 'Andaman and Nicobar Islands', region: 'UT' },
  { name: 'Chandigarh', region: 'UT' },
  { name: 'Dadra and Nagar Haveli', region: 'UT' },
  { name: 'Daman and Diu', region: 'UT' },
  { name: 'Lakshadweep', region: 'UT' },
  { name: 'Delhi', region: 'UT' },
  { name: 'Puducherry', region: 'UT' },
  { name: 'Jammu and Kashmir', region: 'North' }
];

// 🎯 Generate realistic score
const getScoreByRegion = (region) => {
  switch (region) {
    case 'South': return 70 + Math.floor(Math.random() * 30);
    case 'North': return 50 + Math.floor(Math.random() * 40);
    case 'West': return 60 + Math.floor(Math.random() * 30);
    case 'East': return 40 + Math.floor(Math.random() * 40);
    case 'Central': return 45 + Math.floor(Math.random() * 35);
    case 'Northeast': return 30 + Math.floor(Math.random() * 50);
    case 'UT': return 50 + Math.floor(Math.random() * 40);
    default: return Math.floor(Math.random() * 100);
  }
};

// 🎯 Label logic
const getLabel = (score) => {
  if (score >= 70) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
};

// 🔥 Seeder Function
const seedStates = async () => {
  try {
    await mongoose.connect(DB);
    console.log('✅ DB connection successful!');

    for (const s of statesArray) {
      const exists = await State.findOne({ name: s.name });

      if (!exists) {
        const score = getScoreByRegion(s.region);

        const newState = await State.create({
          name: s.name,
          slug: s.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''),
          region: s.region,
          complianceScore: score,
          label: getLabel(score)
        });

        console.log(`✅ Created: ${newState.name} (${score}%)`);
      } else {
        console.log(`⚠️ Already exists: ${s.name}`);
      }
    }

    console.log('🎉 States seeding completed!');
    process.exit();

  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

seedStates();