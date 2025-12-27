import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { Users, Target, Heart, Award } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="About Us"
        description="Learn about Smart Village Mart's mission to empower local businesses and connect communities through technology. Supporting rural shopkeepers across India."
        keywords="about smart village mart, rural commerce, village shopkeepers, local business platform, rural India, village economy"
      />
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6">About Smart Village Mart</h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-emerald-100">
            Empowering local businesses and connecting communities through technology
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            <Card>
              <CardContent className="p-6 sm:p-8">
                <Target className="h-12 w-12 text-emerald-600 mb-4" />
                <h2 className="text-xl sm:text-2xl mb-3 sm:mb-4">Our Mission</h2>
                <p className="text-gray-700">
                  To bridge the digital divide and empower village shopkeepers by providing them with a platform to reach wider audiences, while offering customers access to authentic local products.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 sm:p-8">
                <Heart className="h-12 w-12 text-emerald-600 mb-4" />
                <h2 className="text-xl sm:text-2xl mb-3 sm:mb-4">Our Vision</h2>
                <p className="text-gray-700">
                  To become India's leading platform for rural commerce, fostering sustainable growth for local businesses while preserving the authenticity of traditional marketplaces.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl text-center mb-6 sm:mb-8">Our Story</h2>
            <p className="text-gray-700 mb-6">
              Smart Village Mart was born from a simple observation: village shopkeepers possess incredible knowledge and authentic products, but lack the digital tools to compete in today's market. Meanwhile, urban customers increasingly seek authentic, locally-sourced products.
            </p>
            <p className="text-gray-700 mb-6">
              Founded in 2024, we set out to create a platform that benefits both sides - giving shopkeepers access to modern e-commerce tools while connecting customers with the authentic products they desire.
            </p>
            <p className="text-gray-700">
              Today, we serve over 500 shops across rural India, helping them grow their businesses while preserving the personal touch that makes village markets special.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl text-center mb-8 sm:mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg sm:text-xl mb-2">Community First</h3>
              <p className="text-gray-600">
                We believe in the power of local communities and strive to strengthen village economies.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl mb-2">Quality & Authenticity</h3>
              <p className="text-gray-600">
                We ensure all products meet high standards while maintaining their traditional authenticity.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl mb-2">Sustainable Growth</h3>
              <p className="text-gray-600">
                We focus on long-term, sustainable growth that benefits all stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl text-center mb-8 sm:mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <p className="text-4xl text-emerald-600 mb-2">500+</p>
              <p className="text-gray-600">Registered Shops</p>
            </div>
            <div>
              <p className="text-4xl text-emerald-600 mb-2">10,000+</p>
              <p className="text-gray-600">Products Listed</p>
            </div>
            <div>
              <p className="text-4xl text-emerald-600 mb-2">5,000+</p>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl text-emerald-600 mb-2">50+</p>
              <p className="text-gray-600">Villages Covered</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
