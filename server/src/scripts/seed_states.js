const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '/Users/ayushpandey/Desktop/RTE/server/.env' });

const State = require('/Users/ayushpandey/Desktop/RTE/server/src/models/State');

const DB = process.env.MONGODB_URI;

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
  { name: 'Orissa', region: 'East' },
  { name: 'Punjab', region: 'North' },
  { name: 'Rajasthan', region: 'North' },
  { name: 'Sikkim', region: 'Northeast' },
  { name: 'Tamil Nadu', region: 'South' },
  { name: 'Telangana', region: 'South' },
  { name: 'Tripura', region: 'Northeast' },
  { name: 'Uttar Pradesh', region: 'North' },
  { name: 'Uttaranchal', region: 'North' },
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

mongoose.connect(DB).then(async () => {
    console.log('DB connection successful!');
    
    for (const s of statesArray) {
        try {
            const exists = await State.findOne({ name: s.name });
            if (!exists) {
                await State.create({
                    name: s.name,
                    slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                    region: s.region
                });
                console.log(`Created: ${s.name}`);
            }
        } catch (err) {
            console.error(err);
        }
    }
    
    console.log('States seeding completed!');
    process.exit();
}).catch(err => {
    console.log(err);
    process.exit(1);
});
