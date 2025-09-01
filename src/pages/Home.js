import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import BlogPreview from '../components/BlogPreview';
import Footer from '../components/Footer';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const Home = () => {
  const [latestPosts, setLatestPosts] = useState([]);

  const features = [
    {
      imageSrc: '/assets/write-freely.webp',
      title: 'Write Freely',
      description: 'Create posts with a powerful editor.',
    },
    {
      imageSrc: '/assets/community.jpg',
      title: 'Community Driven',
      description: 'Interact with a vibrant community.',
    },
    {
      imageSrc: '/assets/learn-grow.jpg',
      title: 'Learn & Grow',
      description: 'Read content that makes you smarter.',
    },
  ];

  useEffect(() => {
  const fetchLatestPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts/latest');
      const data = await res.json();
      console.log('Fetched latestPosts:', data); // ✅ correct

      if (Array.isArray(data)) {
        setLatestPosts(data);
      } else {
        console.error('Expected an array, got:', data);
        setLatestPosts([]);
      }
    } catch (err) {
      console.error('Error fetching latest posts:', err);
      setLatestPosts([]);
    }
  };

  fetchLatestPosts();
}, []);


  return (
    <div>
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose Blogify?</h2>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Slider */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Latest Blog Posts</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
              {latestPosts.map((post, idx) => (
                <SwiperSlide key={idx}>
                  <BlogPreview
                    imageSrc={`http://localhost:5000${post.imageUrl}`}
                    title={post.title}
                    excerpt={post.content.substring(0, 100) + '...'}
                    username={post.author?.username || 'Anonymous'}
                    id={post._id}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
