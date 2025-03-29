
import React from 'react';
import { 
  HeartHandshake, 
  GraduationCap, 
  Sprout, 
  UserCheck 
} from 'lucide-react';
import Layout from '@/components/Layout';

const MissionPage = () => {
  return (
    <Layout>
      <div className="mission-page max-w-4xl mx-auto">
        <div className="mission-header text-center mb-12">
          <HeartHandshake className="w-16 h-16 mx-auto text-spiritless-pink mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Creating a vibrant community where everyone can enjoy exceptional non-alcoholic experiences
          </p>
        </div>

        <div className="mission-content space-y-16">
          <section className="mission-section">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Believe</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              At Spiritless, we believe that everyone deserves to enjoy incredible drink experiences regardless of whether they consume alcohol. We're passionate about creating a world where non-alcoholic options are celebrated, not just tolerated, and where the social experience isn't dependent on alcohol consumption.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our platform exists to connect people with exceptional non-alcoholic experiences, to highlight venues that go beyond the basics, and to foster a community that celebrates the craftsmanship and creativity in non-alcoholic beverages.
            </p>
          </section>

          <section className="mission-values grid md:grid-cols-3 gap-8">
            <div className="value-card bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="icon-wrapper bg-spiritless-pink/10 p-3 rounded-full w-fit mb-4">
                <Sprout className="h-6 w-6 text-spiritless-pink" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Inclusivity</h3>
              <p className="text-gray-600">
                Creating spaces and experiences that welcome everyone, regardless of their relationship with alcohol.
              </p>
            </div>
            
            <div className="value-card bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="icon-wrapper bg-spiritless-pink/10 p-3 rounded-full w-fit mb-4">
                <GraduationCap className="h-6 w-6 text-spiritless-pink" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Education</h3>
              <p className="text-gray-600">
                Sharing knowledge about non-alcoholic options and empowering people to make informed choices.
              </p>
            </div>
            
            <div className="value-card bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="icon-wrapper bg-spiritless-pink/10 p-3 rounded-full w-fit mb-4">
                <UserCheck className="h-6 w-6 text-spiritless-pink" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600">
                Building connections among people who appreciate quality non-alcoholic experiences.
              </p>
            </div>
          </section>

          <section className="mission-impact">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Impact</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Since our founding, we've connected thousands of people with venues that prioritize exceptional non-alcoholic options. We've worked with bartenders and establishments to expand their offerings and have facilitated a growing community of non-alcoholic enthusiasts.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We measure our success not just in user numbers, but in the stories of people who have found new favorite spots, in the establishments that have expanded their non-alcoholic menus, and in the growing recognition that non-alcoholic doesn't mean compromising on taste or experience.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default MissionPage;
