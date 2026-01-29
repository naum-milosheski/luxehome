import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import FeaturedPropertiesGrid from '@/components/FeaturedPropertiesGrid';
import FadeIn from '@/components/FadeIn';
import { getProperties } from './actions/properties';

export default async function Home() {
  const { data: featuredProperties } = await getProperties({ limit: 3, sort: 'Newest First' });

  return (
    <main className="min-h-screen bg-brand-bg pb-20">
      <Navbar />
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 mt-20 mb-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-brand-dark">Featured Properties</h2>
          <Link href="/listings" className="text-brand-dark font-medium hover:text-brand-lime transition-colors">
            View All Properties →
          </Link>
        </div>

        <FeaturedPropertiesGrid properties={featuredProperties} />

      </div>

      <FadeIn delay={0.2}>
        <FeaturesSection />
      </FadeIn>
    </main>
  );
}
