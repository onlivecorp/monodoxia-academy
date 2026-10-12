import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Areas from '../components/Areas';
import Academy from '../components/Academy';
import Club from '../components/Club';
import Coaches from '../components/Coaches';
import Community from '../components/Community';
import Events from '../components/Events';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Newsletter from '../components/Newsletter';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Areas />
      <Academy />
      <Club />
      <Coaches />
      <Community />
      <Events />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </>
  );
}
