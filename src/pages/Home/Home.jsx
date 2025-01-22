import { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Tv, Gamepad, Star, ChevronDown } from 'lucide-react';

const HomePage = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    {
      title: "Movies",
      icon: <Play className="w-12 h-12" />,
      description: "Discover the latest blockbusters and timeless classics.",
      path: "/movies"
    },
    {
      title: "TV Shows",
      icon: <Tv className="w-12 h-12" />,
      description: "Binge-worthy series and must-watch episodes.",
      path: "/tv-shows"
    },
    {
      title: "Games",
      icon: <Gamepad className="w-12 h-12" />,
      description: "From indie gems to AAA titles, find your next adventure.",
      path: "/games"
    },
    {
      title: "Top Rated",
      icon: <Star className="w-12 h-12" />,
      description: "The best of the best across all categories.",
      path: "/top-rated"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.div 
        style={{ opacity }}
        className="h-screen flex flex-col items-center justify-center relative"
      >
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-bold mb-6"
        >
          Screen<span className="text-scout-green">Scout</span>
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-300 text-center max-w-2xl mb-12"
        >
          Your personal guide to the best entertainment across movies, shows, and games.
        </motion.p>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10"
        >
          <ChevronDown className="w-8 h-8 text-scout-green" />
        </motion.div>
      </motion.div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={category.path} className="block">
                <div className="bg-gray-900 p-8 rounded-lg hover:bg-gray-800 transition-all duration-300 border border-scout-green/20 hover:border-scout-green group">
                  <div className="text-scout-green mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{category.title}</h2>
                  <p className="text-gray-400">{category.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="bg-gray-900 py-24"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose <span className="text-scout-green">ScreenScout</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Personalized Recommendations",
                description: "Get tailored suggestions based on your preferences."
              },
              {
                title: "Comprehensive Database",
                description: "Access detailed information about thousands of movies, shows, and games."
              },
              {
                title: "Real-time Updates",
                description: "Stay informed about new releases and trending content."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;