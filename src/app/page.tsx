"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-black font-sans">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-luxury-black/90 backdrop-blur-md text-luxury-ivory border-b border-luxury-charcoal">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-serif text-2xl tracking-widest text-luxury-gold">
            EL REFUGIO
          </div>
          <nav className="hidden md:flex space-x-8 text-sm tracking-wider uppercase">
            <a href="#hospedaje" className="hover:text-luxury-gold transition-colors">Hospedaje</a>
            <a href="#amenidades" className="hover:text-luxury-gold transition-colors">Amenidades</a>
            <a href="#galeria" className="hover:text-luxury-gold transition-colors">Galería</a>
            <a href="#contacto" className="hover:text-luxury-gold transition-colors">Contacto</a>
          </nav>
          <div className="hidden md:block">
            <button className="bg-luxury-gold text-luxury-black px-6 py-2 uppercase tracking-wider text-sm font-semibold hover:bg-luxury-champagne transition-colors">
              Reservar
            </button>
          </div>
          <button className="md:hidden text-luxury-ivory" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/imagenes/HotelA.png"
            alt="Hotel Exterior"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
          {/* subtle gold gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-serif text-luxury-ivory mb-6"
          >
            Donde el Lujo se Encuentra con la Naturaleza
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-luxury-champagne mb-10 tracking-wide"
          >
            Experimente la elegancia clásica y la sofisticación moderna en nuestras habitaciones y villas exclusivas.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            <a href="#hospedaje" className="inline-flex items-center gap-2 bg-luxury-gold text-luxury-black px-8 py-4 uppercase tracking-wider text-sm font-semibold hover:bg-luxury-champagne transition-all">
              Descubra el Hospedaje
              <ChevronRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 bg-luxury-ivory text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-luxury-black mb-6">
            Una Estancia Inolvidable
          </h2>
          <div className="w-16 h-1 bg-luxury-gold mx-auto mb-8"></div>
          <p className="text-luxury-charcoal text-lg leading-relaxed">
            Inspirado en la grandeza del lujo clásico, nuestro resort ofrece un refugio de paz y exclusividad. Desde habitaciones sofisticadas y villas privadas con vistas impresionantes hasta amenidades de clase mundial, cada detalle está diseñado para cautivar sus sentidos.
          </p>
        </div>
      </section>

      {/* Hospedaje Section */}
      <section id="hospedaje" className="py-24 bg-luxury-black text-luxury-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-serif text-luxury-champagne mb-4">Habitaciones y Villas</h2>
              <p className="text-gray-400 max-w-lg">Refugios diseñados con elegancia atemporal. Elija entre nuestras sofisticadas habitaciones de hotel o la exclusividad y privacidad de nuestras villas.</p>
            </div>
            <button className="mt-6 md:mt-0 text-luxury-gold uppercase tracking-wider text-sm flex items-center gap-2 hover:text-luxury-champagne transition-colors">
              Ver todas las opciones <ChevronRight size={16} />
            </button>
          </div>

          <div className="mb-16">
            <h3 className="text-3xl font-serif text-luxury-ivory border-b border-luxury-charcoal pb-4 mb-8">Habitaciones del Hotel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Habitacion Regular */}
              <div className="group cursor-pointer">
                <div className="relative h-[400px] overflow-hidden">
                  <Image src="/imagenes/RegularB.jpg" alt="Habitación Regular" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                <div className="pt-6">
                  <h3 className="text-2xl font-serif mb-2">Habitación Clásica</h3>
                  <p className="text-luxury-gold mb-4 text-sm uppercase tracking-widest">Desde $250 / noche</p>
                  <p className="text-gray-400 text-sm line-clamp-2">Elegancia intemporal con vistas a los jardines. Un santuario de confort y serenidad con detalles clásicos.</p>
                </div>
              </div>
              {/* Habitacion Premium */}
              <div className="group cursor-pointer">
                <div className="relative h-[400px] overflow-hidden">
                  <Image src="/imagenes/PremiumA.jpg" alt="Habitación Premium" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                <div className="pt-6">
                  <h3 className="text-2xl font-serif mb-2">Suite Premium</h3>
                  <p className="text-luxury-gold mb-4 text-sm uppercase tracking-widest">Desde $400 / noche</p>
                  <p className="text-gray-400 text-sm line-clamp-2">Espacios amplios con balcón privado y amenidades de lujo superior para una estancia verdaderamente inolvidable.</p>
                </div>
              </div>
              {/* Habitacion VIP */}
              <div className="group cursor-pointer">
                <div className="relative h-[400px] overflow-hidden">
                  <Image src="/imagenes/VIPA.jpg" alt="Habitación VIP" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                <div className="pt-6">
                  <h3 className="text-2xl font-serif mb-2">Suite VIP</h3>
                  <p className="text-luxury-gold mb-4 text-sm uppercase tracking-widest">Desde $650 / noche</p>
                  <p className="text-gray-400 text-sm line-clamp-2">El pináculo del lujo hotelero, con vistas panorámicas, sala de estar separada y atención personalizada.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-serif text-luxury-ivory border-b border-luxury-charcoal pb-4 mb-8">Villas Exclusivas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Villa A */}
              <div className="group cursor-pointer">
                <div className="relative h-[400px] overflow-hidden">
                  <Image src="/imagenes/villaA1.jpg" alt="Villa Tipo A" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                <div className="pt-6">
                  <h3 className="text-2xl font-serif mb-2">Villa Zafiro</h3>
                  <p className="text-luxury-gold mb-4 text-sm uppercase tracking-widest">Desde $900 / noche</p>
                  <p className="text-gray-400 text-sm line-clamp-2">Un refugio íntimo rodeado de naturaleza exótica, ideal para parejas que buscan privacidad absoluta y romance.</p>
                </div>
              </div>
              {/* Villa B */}
              <div className="group cursor-pointer">
                <div className="relative h-[400px] overflow-hidden">
                  <Image src="/imagenes/villaB1.jpg" alt="Villa Tipo B" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                <div className="pt-6">
                  <h3 className="text-2xl font-serif mb-2">Villa Esmeralda</h3>
                  <p className="text-luxury-gold mb-4 text-sm uppercase tracking-widest">Desde $1,200 / noche</p>
                  <p className="text-gray-400 text-sm line-clamp-2">Diseño majestuoso con piscina privada y terrazas expansivas para disfrutar al máximo al aire libre en familia o amigos.</p>
                </div>
              </div>
              {/* Villa C */}
              <div className="group cursor-pointer">
                <div className="relative h-[400px] overflow-hidden">
                  <Image src="/imagenes/villaC1.jpg" alt="Villa Tipo C" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                <div className="pt-6">
                  <h3 className="text-2xl font-serif mb-2">Villa Diamante</h3>
                  <p className="text-luxury-gold mb-4 text-sm uppercase tracking-widest">Desde $1,800 / noche</p>
                  <p className="text-gray-400 text-sm line-clamp-2">Nuestra residencia más grande e imponente, con servicio de mayordomo las 24 horas y amenidades verdaderamente incomparables.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenidades" className="py-24 bg-luxury-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-luxury-black mb-4">Experiencias y Bienestar</h2>
            <div className="w-16 h-1 bg-luxury-gold mx-auto mb-6"></div>
            <p className="text-luxury-charcoal max-w-2xl mx-auto">Relaje su cuerpo y mente en nuestras instalaciones de primer nivel. Un santuario dedicado a su bienestar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-auto md:h-[600px]">
            {/* Spa */}
            <div className="relative group overflow-hidden h-[400px] md:h-full lg:col-span-1">
              <Image src="/imagenes/SpaA.jpg" alt="Spa Clásico" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 text-luxury-ivory w-full">
                <h3 className="text-3xl font-serif mb-2">Spa Clásico</h3>
                <p className="text-luxury-champagne text-sm uppercase tracking-wider mb-4">Terapias Rejuvenecedoras</p>
                <p className="text-gray-200 text-sm hidden md:block">Tratamientos exclusivos con ingredientes naturales y técnicas milenarias para una relajación profunda y revitalización del espíritu.</p>
              </div>
            </div>

            <div className="grid grid-rows-2 gap-6 lg:col-span-2 h-[600px] md:h-full">
              {/* Pool */}
              <div className="relative group overflow-hidden">
                <Image src="/imagenes/PiscinaA3.jpg" alt="Piscina Infinita" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 p-6 text-luxury-ivory w-full bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-2xl font-serif">Piscina Infinita</h3>
                  <p className="text-luxury-gold text-xs uppercase tracking-wider">Vistas Espectaculares</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Gym */}
                <div className="relative group overflow-hidden">
                  <Image src="/imagenes/GymB.png" alt="Gimnasio" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 p-6 text-luxury-ivory w-full bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-xl font-serif">Fitness Center</h3>
                    <p className="text-luxury-gold text-xs uppercase tracking-wider">Equipo de Vanguardia</p>
                  </div>
                </div>
                {/* Wellness */}
                <div className="relative group overflow-hidden bg-luxury-charcoal">
                  <Image src="/imagenes/WellnessA2.jpg" alt="Wellness" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 p-6 text-luxury-ivory w-full bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-xl font-serif">Clases Wellness</h3>
                    <p className="text-sm text-gray-300">Diariamente con instructores certificados.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-luxury-black text-gray-400 py-16 border-t border-luxury-charcoal">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="font-serif text-2xl tracking-widest text-luxury-gold mb-6">
              EL REFUGIO
            </div>
            <p className="max-w-sm">
              Redefiniendo el lujo y la sofisticación. Un destino exclusivo para los viajeros más exigentes que buscan excelencia en cada detalle.
            </p>
          </div>
          <div>
            <h4 className="text-luxury-ivory font-semibold uppercase tracking-wider mb-6">Explorar</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#hospedaje" className="hover:text-luxury-gold transition-colors">Habitaciones y Villas</a></li>
              <li><a href="#amenidades" className="hover:text-luxury-gold transition-colors">Experiencias y Bienestar</a></li>
              <li><a href="#galeria" className="hover:text-luxury-gold transition-colors">Gastronomía</a></li>
              <li><a href="#" className="hover:text-luxury-gold transition-colors">Eventos Privados</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-luxury-ivory font-semibold uppercase tracking-wider mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3"><MapPin size={16} className="text-luxury-gold" /> Av. del Mar 123, Paraíso</li>
              <li className="flex items-center gap-3"><Phone size={16} className="text-luxury-gold" /> +1 (800) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-luxury-charcoal text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} El Refugio Resort & Villas. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-luxury-ivory transition-colors">Privacidad</a>
            <a href="#" className="hover:text-luxury-ivory transition-colors">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
