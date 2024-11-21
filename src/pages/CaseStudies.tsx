import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

interface Case {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
}

const cases: Case[] = [
  {
    id: 1,
    title: "Campaña Digital Innovadora",
    category: "Marketing Digital",
    description: "Estrategia multiplataforma que incrementó el engagement en un 150%",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    title: "Rebranding Corporativo",
    category: "Branding",
    description: "Renovación completa de identidad visual con impacto global",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "Campaña Social Impact",
    category: "Social Media",
    description: "Campaña viral con más de 1M de interacciones orgánicas",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
  }
];

const CaseStudies = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Casos de Éxito
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Descubre cómo hemos ayudado a nuestros clientes a alcanzar sus objetivos a través de estrategias innovadoras y creativas.
          </p>
        </div>
      </div>

      {/* Cases Grid */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 py-16"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={caseItem.imageUrl}
                  alt={caseItem.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {caseItem.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{caseItem.title}</h3>
                <p className="text-gray-600 mb-4">{caseItem.description}</p>
                <button className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                  Ver caso completo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CaseStudies;