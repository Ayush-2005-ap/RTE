require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const LandingBook = require('../models/LandingBook');

const bookContent = [
  {
    order: 0,
    type: 'contents',
    title: 'Table of Contents',
    items: [
      'Chapter 1: Preliminary',
      'Chapter 2: Right to Free and Compulsory Education',
      'Chapter 3: Duties of Appropriate Government',
      'Chapter 4: Responsibilities of Schools and Teachers',
      'Chapter 5: Curriculum and Completion of Education',
      'Chapter 6: Protection of Right of Children',
      'Chapter 7: Miscellaneous',
      'Schedule',
      'Amendments & Case Laws',
      'State Rules'
    ]
  },
  {
    order: 1,
    type: 'chapter',
    title: 'Chapter 1: Preliminary',
    desc: 'This chapter outlines the short title, extent, and commencement of the Act. It provides essential definitions such as "child," "appropriate Government," "local authority," and defining types of schools covered under the legislation. It sets the scope of the right to education.',
  },
  {
    order: 2,
    type: 'chapter',
    title: 'Chapter 2: Right to Free & Compulsory Education',
    desc: 'Guarantees the fundamental right of every child aged 6 to 14 to free and compulsory education in a neighborhood school. Explains special provisions for children not admitted to, or who have not completed, elementary education, ensuring their right to transfer to other schools.',
  },
  {
    order: 3,
    type: 'chapter',
    title: 'Chapter 3: Duties of Appropriate Government',
    desc: 'Details the obligations of the government and local authorities to establish schools within a defined distance, provide infrastructure, ensure non-discrimination, and guarantee training facilities for teachers. It also covers the sharing of financial responsibilities.',
  },
  {
    order: 4,
    type: 'chapter',
    title: 'Chapter 4: Responsibilities of Schools',
    desc: 'Mandates 25% reservation for children from disadvantaged groups in private schools. Prohibits capitation fees, screening procedures, physical punishment, and mental harassment. Defines the qualifications required for teachers and their duties.',
  },
  {
    order: 5,
    type: 'chapter',
    title: 'Chapter 5: Curriculum & Completion',
    desc: 'Lays down norms for the curriculum and evaluation procedure, emphasizing all-round development of the child, building on the child\'s knowledge, and learning through activities. Mandates no child shall be held back or expelled until completion of elementary education.',
  },
  {
    order: 6,
    type: 'chapter',
    title: 'Chapter 6: Protection of Rights',
    desc: 'Constitutes the National and State Commissions for Protection of Child Rights (NCPCR and SCPCR) to monitor the child\'s right to education and inquire into complaints relating to child\'s right to education.',
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rte')
  .then(async () => {
    console.log('Connected to DB');
    await LandingBook.deleteMany({});
    await LandingBook.insertMany(bookContent);
    console.log('Book seeded successfully!');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
