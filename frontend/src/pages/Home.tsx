import { Hero } from '../components/Hero';
import { AboutGD } from '../components/AboutGD';
import { ContactForm } from '../components/ContactForm';
import { AboutCompany } from '../components/AboutCompany';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* About GD Section */}
      <AboutGD />

      {/* Contact Form Section */}
      <ContactForm />

      {/* About Company Section */}
      <AboutCompany />

      {/* Footer */}
      <Footer />
    </>
  );
}
