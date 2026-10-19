import React, { useEffect } from 'react';
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
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const elementsToObserve = document.querySelectorAll(
      '.anim-badge, .anim-about-badge, .anim-subtext, [class*="anim-"][class*="-title"]'
    );
    elementsToObserve.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

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
