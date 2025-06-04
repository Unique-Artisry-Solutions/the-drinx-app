
import React, { useState } from 'react';
import { FileText, Shield, Lock, Eye } from 'lucide-react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LegalPage = () => {
  const [activeTab, setActiveTab] = useState("terms");

  return (
    <Layout>
      <div className="legal-page max-w-4xl mx-auto">
        <div className="legal-header text-center mb-12">
          <FileText className="w-16 h-16 mx-auto text-spiritless-pink mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Information</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our commitment to transparency and protecting your rights
          </p>
        </div>

        <div className="legal-content">
          <Tabs defaultValue="terms" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="terms" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Terms of Service</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Privacy Policy</span>
              </TabsTrigger>
              <TabsTrigger value="cookies" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Cookie Policy</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="terms" className="border rounded-md p-6 mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Terms of Service</h2>
              <div className="terms-content space-y-4 text-gray-700">
                <p className="text-sm text-gray-500">Last updated: June 1, 2023</p>
                
                <section className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-800">1. Introduction</h3>
                  <p>
                    Welcome to Spiritless. By accessing our website, mobile application, or any of our services, you agree to be bound by these Terms of Service. Please read them carefully.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-800">2. Definitions</h3>
                  <p>
                    "Spiritless," "we," "us," and "our" refer to Spiritless Inc. "Service" refers to the website, mobile application, and other related services provided by Spiritless. "User," "you," and "your" refer to any individual who accesses or uses our Service.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-800">3. Account Registration</h3>
                  <p>
                    To use certain features of the Service, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-800">4. User Conduct</h3>
                  <p>
                    You agree not to use the Service for any illegal or unauthorized purpose. You agree to comply with all laws, rules, and regulations applicable to your use of the Service.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-800">5. Disclaimer of Warranties</h3>
                  <p>
                    The Service is provided on an "as is" and "as available" basis. Spiritless makes no representations or warranties of any kind, express or implied, as to the operation of the Service or the information, content, materials, or products included on the Service.
                  </p>
                </section>
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="border rounded-md p-6 mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Privacy Policy</h2>
              <div className="privacy-content space-y-4 text-gray-700">
                <p className="text-sm text-gray-500">Last updated: June 1, 2023</p>
                
                <section className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-800">1. Information We Collect</h3>
                  <p>
                    We collect information you provide directly to us, such as when you create an account, update your profile, use the interactive features of our Service, participate in a contest, promotion, or survey, request customer support, or otherwise communicate with us.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-800">2. How We Use Information</h3>
                  <p>
                    We use the information we collect to provide, maintain, and improve our Service, such as to process transactions, send you related information, and provide customer support.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-800">3. Sharing of Information</h3>
                  <p>
                    We may share the information we collect as follows: with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf; in response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process; and with your consent or at your direction.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-800">4. Data Retention</h3>
                  <p>
                    We store the information we collect about you for as long as is necessary for the purpose(s) for which we originally collected it. We may retain certain information for legitimate business purposes or as required by law.
                  </p>
                </section>
              </div>
            </TabsContent>
            
            <TabsContent value="cookies" className="border rounded-md p-6 mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookie Policy</h2>
              <div className="cookies-content space-y-4 text-gray-700">
                <p className="text-sm text-gray-500">Last updated: June 1, 2023</p>
                
                <section className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-800">1. What Are Cookies</h3>
                  <p>
                    Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-800">2. How We Use Cookies</h3>
                  <p>
                    We use cookies for various purposes including: to understand and save user's preferences for future visits; to compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future; and to help remember and process the items in the shopping cart.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-800">3. Types of Cookies We Use</h3>
                  <p>
                    Session Cookies: These cookies are temporary and are erased when you close your browser. Persistent Cookies: These cookies remain on your device until you erase them or they expire. Third-Party Cookies: These cookies are placed by a third-party service provider.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-800">4. Your Choices Regarding Cookies</h3>
                  <p>
                    If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer.
                  </p>
                </section>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default LegalPage;
