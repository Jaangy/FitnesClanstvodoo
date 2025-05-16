import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, ArrowRight, CheckCircle, Calendar, Users, CreditCard } from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Transform Your Fitness Journey Today
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Join Fitnes d.o.o. for personalized workouts, expert instructors, and a supportive community to help you achieve your fitness goals.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                        Join Now
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <img 
                src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Fitness training" 
                className="rounded-lg shadow-2xl max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Fitnes d.o.o.</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a comprehensive fitness experience designed to help you achieve your personal goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Dumbbell className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Diverse Class Offerings</h3>
              <p className="text-gray-600 mb-4">
                Choose from a wide variety of classes including Yoga, HIIT, Strength Training, Spinning, and CrossFit.
              </p>
              <Link to="/classes" className="text-blue-600 font-medium flex items-center">
                View Classes <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Instructors</h3>
              <p className="text-gray-600 mb-4">
                Train with our certified instructors who are passionate about helping you reach your fitness goals.
              </p>
              <Link to="/instructors" className="text-blue-600 font-medium flex items-center">
                Meet Our Team <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Scheduling</h3>
              <p className="text-gray-600 mb-4">
                Book classes according to your schedule with our easy-to-use online reservation system.
              </p>
              <Link to="/schedule" className="text-blue-600 font-medium flex items-center">
                View Schedule <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Membership Plans</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the membership that fits your lifestyle and fitness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Monthly Plan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-extrabold text-gray-900">€49</span>
                  <span className="text-gray-600 ml-1">/month</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Access to all basic classes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Gym access during regular hours</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Basic fitness assessment</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button variant="outline" fullWidth>
                    Choose Plan
                  </Button>
                </div>
              </div>
            </div>

            {/* Quarterly Plan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border-2 border-blue-500 transform scale-105">
              <div className="bg-blue-500 py-2 text-white text-center text-sm font-medium">
                MOST POPULAR
              </div>
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Quarterly</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-extrabold text-gray-900">€129</span>
                  <span className="text-gray-600 ml-1">/3 months</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Access to all classes including premium</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Extended gym hours access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>1 personal training session</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Detailed fitness assessment</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button variant="primary" fullWidth>
                    Choose Plan
                  </Button>
                </div>
              </div>
            </div>

            {/* Annual Plan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Annual</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-extrabold text-gray-900">€449</span>
                  <span className="text-gray-600 ml-1">/year</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>All benefits of Quarterly plan</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>24/7 gym access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>4 personal training sessions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Quarterly progress reviews</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button variant="outline" fullWidth>
                    Choose Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Fitness Journey?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Join our community today and get access to professional trainers, diverse classes, and a supportive environment.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Join Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;