import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  ScaleIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const provisions = [
  { 
    title: 'Free & Compulsory Education', 
    desc: 'Every child between 6 and 14 years of age has the right to free and compulsory elementary education (Classes 1-8) in a neighbourhood school.',
    icon: AcademicCapIcon,
  },
  { 
    title: '25% EWS Reservation', 
    desc: 'Every private unaided school must reserve 25% seats for children from economically weaker sections and disadvantaged groups.',
    icon: BanknotesIcon,
  },
  { 
    title: 'No Detention Policy', 
    desc: 'No child can be held back in any class or expelled from school until completion of elementary education.',
    icon: ShieldCheckIcon,
  },
  { 
    title: 'School Quality Norms', 
    desc: 'Schools must meet prescribed standards on infrastructure, teacher-pupil ratio, working days and teaching hours.',
    icon: BuildingLibraryIcon,
  },
  { 
    title: 'Trained Teachers', 
    desc: 'All teachers must possess minimum qualifications as prescribed by the academic authority. Untrained teachers must acquire qualifications within 5 years.',
    icon: CheckBadgeIcon,
  },
  { 
    title: 'School Management', 
    desc: 'Every government and aided school must constitute an SMC with 75% representation from parents/guardians.',
    icon: UsersIcon,
  },
];

const timeline = [
  { year: '2002', event: '86th Constitutional Amendment', desc: 'Education added to Part III as Fundamental Right (Article 21A)' },
  { year: '2009', event: 'RTE Act Enacted', desc: 'RTE Act enacted on August 4, 2009 by Parliament of India' },
  { year: '2010', event: 'Act Comes into Force', desc: 'Act comes into force on April 1, 2010 across India' },
  { year: '2011', event: '25% EWS Reservation', desc: 'States submit their RTE Rules; 25% EWS reservation begins' },
  { year: '2017', event: 'Supreme Court Ruling', desc: 'Supreme Court upholds constitutionality of 25% EWS quota in unaided private schools' },
  { year: '2019', event: 'RTE Amendment', desc: 'No detention policy modified to allow detention in Class 5 and 8' },
];

export default function AboutRTEPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-white pt-16 font-sans selection:bg-saffron/30">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient border-b border-navy-800 py-24 sm:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-navy-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-saffron/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron/10 border border-saffron/20 text-saffron text-sm font-medium mb-8">
              <BookOpenIcon className="w-4 h-4" />
              <span>Right to Education Act, 2009</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold font-display text-white mb-8 tracking-tight">
              Know Your <span className="text-saffron">RTE</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-200 leading-relaxed max-w-2xl mx-auto">
              Understanding the landmark legislation that protects every child's fundamental right to free and compulsory elementary education in India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is RTE */}
      <section className="py-24 px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-saffron" />
                <span className="text-saffron font-bold uppercase tracking-[0.2em] text-xs">The Law</span>
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold font-display text-navy mb-8">
                What is the RTE Act?
              </motion.h2>
              <motion.div variants={itemVariants} className="prose prose-lg text-ink">
                <p className="mb-6 leading-relaxed">
                  The Right of Children to Free and Compulsory Education (RTE) Act, 2009 is a landmark legislation that made India one of 135 countries to make education a fundamental right.
                </p>
                <p className="mb-6 leading-relaxed">
                  Enacted on August 4, 2009 and coming into force on April 1, 2010, the Act mandates free and compulsory education for all children between <strong className="text-navy font-bold">6 and 14 years</strong> and makes education a Fundamental Right under Article 21A of the Indian Constitution.
                </p>
                <div className="p-6 bg-parchment-gradient border-l-4 border-saffron rounded-r-2xl shadow-sm my-8">
                   <p className="text-navy-800 italic font-medium m-0">
                     "The Act places the responsibility of ensuring enrollment, attendance and completion of elementary education on the State."
                   </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 bg-saffron-gradient opacity-10 rounded-[2rem] transform rotate-3 scale-105 transition-transform duration-500 hover:rotate-6" />
              <div className="relative bg-white p-8 sm:p-10 rounded-[2rem] shadow-card border border-navy-50 flex flex-col gap-8">
                 <h3 className="text-2xl font-bold font-display text-navy mb-2">Core Objectives</h3>
                 <div className="space-y-6">
                   {[
                     { text: "Universal access for all children", icon: UsersIcon },
                     { text: "Equity across social groups", icon: ScaleIcon },
                     { text: "Improved quality standards", icon: CheckBadgeIcon },
                     { text: "Zero dropout rates", icon: AcademicCapIcon }
                   ].map((obj, i) => (
                     <div key={i} className="flex items-start gap-4 group">
                       <div className="bg-parchment p-3 rounded-2xl text-saffron group-hover:bg-saffron group-hover:text-white transition-all duration-300">
                         <obj.icon className="w-6 h-6" />
                       </div>
                       <p className="text-ink font-medium pt-3">{obj.text}</p>
                     </div>
                   ))}
                 </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Key Provisions */}
      <section className="py-24 px-6 lg:px-8 bg-parchment relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-saffron font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Guarantees</span>
            <h2 className="text-4xl sm:text-5xl font-bold font-display text-navy mb-6">
              Key Provisions of the Act
            </h2>
            <p className="text-lg text-muted">The RTE Act establishes several key mandates to ensure quality education reaches every child.</p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {provisions.map((p) => (
              <motion.div 
                key={p.title}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white rounded-[2rem] p-8 shadow-card border border-white hover:border-saffron/20 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-parchment text-saffron flex items-center justify-center mb-8 shadow-sm group-hover:bg-saffron group-hover:text-white transition-colors duration-300`}>
                  <p.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-display text-navy mb-4 group-hover:text-saffron transition-colors">{p.title}</h3>
                <p className="text-ink leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Implementation and Timeline Section Combined */}
      <section className="py-24 px-6 lg:px-8 bg-navy text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-navy-800 rounded-full blur-[100px] opacity-50 pointer-events-none" />
         
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
              
              {/* Responsibility & Challenges */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-12"
              >
                 <h2 className="text-4xl font-bold font-display mb-2">
                   Implementation & Responsibility
                 </h2>
                 <p className="text-navy-200 text-lg mb-8">A look at how the government executes and funds the mandates of the RTE Act.</p>
                 
                 <div className="space-y-8">
                    <div className="bg-navy-800/80 p-8 rounded-[2rem] border border-navy-700 backdrop-blur-sm">
                      <h3 className="text-xl font-bold font-display mb-6 text-saffron flex items-center gap-3">
                        <DocumentTextIcon className="w-7 h-7" /> Government Duty
                      </h3>
                      <p className="text-navy-100 mb-6 leading-relaxed">Education is a shared responsibility. The Act mandates that state and central governments must work together to:</p>
                      <ul className="space-y-4 text-navy-100">
                        <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-saffron"/> Ensure enrollment of every child</li>
                        <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-saffron"/> Maintain regular attendance tracking</li>
                        <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-saffron"/> Fund setup via 65:35 (Centre:State) ratio</li>
                      </ul>
                    </div>

                    <div className="bg-navy-800/80 p-8 rounded-[2rem] border border-navy-700 backdrop-blur-sm">
                      <h3 className="text-xl font-bold font-display mb-6 text-parchment flex items-center gap-3">
                        <ScaleIcon className="w-7 h-7 text-saffron" /> Ongoing Challenges
                      </h3>
                      <ul className="space-y-5 text-navy-100">
                        <li className="flex items-start gap-4">
                          <span className="text-saffron font-bold text-lg leading-none mt-0.5">01.</span> 
                          <span className="leading-snug">Millions of children are still out of the formal schooling system.</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="text-saffron font-bold text-lg leading-none mt-0.5">02.</span> 
                          <span className="leading-snug">Severe shortage of professionally trained teachers in rural areas.</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="text-saffron font-bold text-lg leading-none mt-0.5">03.</span> 
                          <span className="leading-snug">Significant infrastructure gaps, including lack of separate toilets and drinking water.</span>
                        </li>
                      </ul>
                    </div>
                 </div>
              </motion.div>

              {/* Timeline */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold font-display mb-2">
                   Key Milestones
                </h2>
                <p className="text-navy-200 text-lg mb-12">The journey of education becoming a fundamental right.</p>

                <div className="relative border-l-2 border-navy-700 ml-4 lg:ml-6 space-y-12 pb-4">
                  {timeline.map((item, index) => (
                    <motion.div 
                      key={item.year}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-10 group"
                    >
                      <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-navy border-4 border-saffron group-hover:bg-saffron transition-colors duration-300 shadow-[0_0_15px_rgba(232,135,42,0.5)] group-hover:shadow-[0_0_20px_rgba(232,135,42,0.8)]" />
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-2">
                        <span className="text-saffron font-black text-2xl font-display">{item.year}</span>
                        <h4 className="text-xl font-bold text-white">{item.event}</h4>
                      </div>
                      <p className="text-navy-200 text-base leading-relaxed max-w-md">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8 bg-parchment-gradient relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[3rem] p-10 md:p-20 shadow-card border border-white"
          >
            <div className="w-20 h-20 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShieldCheckIcon className="w-10 h-10 text-saffron" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-navy mb-6">
              Know your rights. <br className="hidden sm:block" />
              <span className="text-saffron font-style-italic relative inline-block mt-2">
                Exercise them.
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-saffron rounded-full opacity-30" />
              </span>
            </h2>
            <p className="text-lg text-ink mb-12 max-w-2xl mx-auto leading-relaxed">
              If you believe a child's right to education is being violated, or if you have questions about school admissions under the RTE act, our community is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/community/ask" 
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-navy text-white rounded-full font-bold text-lg hover:bg-navy-700 hover:shadow-card hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
              >
                <span>Ask the Community</span>
                <ArrowRightIcon className="w-5 h-5"/>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
