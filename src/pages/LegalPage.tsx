
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
              <div className="privacy-content space-y-6 text-gray-700">
                <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
                
                <section className="space-y-3">
                  <h3 className="text-xl font-medium text-gray-800">1. Information We Collect</h3>
                  
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Personal Information</h4>
                    <p>
                      When you create an account, we collect personal information including your email address, phone number, 
                      profile information, preferences, and authentication credentials. For establishments and promoters, 
                      we also collect business information, venue details, and promotional content.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Payment Information</h4>
                    <p>
                      Payment processing is handled securely through Stripe, our PCI DSS compliant payment processor. 
                      We do not store complete credit card information on our servers. Stripe stores your payment 
                      methods securely and we retain only transaction records, receipts, and billing addresses 
                      necessary for service provision and legal compliance.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Location and Usage Data</h4>
                    <p>
                      We collect location data when you use our mapping features, check into venues, or search for 
                      nearby establishments. We also collect usage analytics, device information, IP addresses, 
                      browser types, and interaction patterns to improve our services and ensure security.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Event and Social Data</h4>
                    <p>
                      When you participate in events, follow promoters, or engage with establishment content, 
                      we collect interaction data, attendance records, preferences, and social connections 
                      within our platform to personalize your experience.
                    </p>
                  </div>
                </section>
                
                <section className="space-y-3">
                  <h3 className="text-xl font-medium text-gray-800">2. How We Use Your Information</h3>
                  
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Service Provision</h4>
                    <p>
                      We use your information to provide and maintain our services, process transactions, 
                      authenticate users, enable communication between users, establishments, and promoters, 
                      and deliver personalized content and recommendations.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Communication</h4>
                    <p>
                      We use your contact information to send service-related notifications, event updates, 
                      promotional communications (with your consent), security alerts, and customer support responses.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Analytics and Improvement</h4>
                    <p>
                      We analyze usage patterns, user preferences, and platform performance to improve our services, 
                      develop new features, ensure security, and provide establishments and promoters with 
                      anonymized analytics about their audiences.
                    </p>
                  </div>
                </section>
                
                <section className="space-y-3">
                  <h3 className="text-xl font-medium text-gray-800">3. Information Sharing and Disclosure</h3>
                  
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Service Providers</h4>
                    <p>
                      We share information with trusted third-party service providers including Supabase (database and authentication), 
                      Stripe (payment processing), cloud hosting providers, analytics services, and communication platforms. 
                      All providers are bound by strict data protection agreements.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Business Transfers</h4>
                    <p>
                      In the event of a merger, acquisition, or sale of assets, user information may be transferred 
                      as part of the business transaction. We will notify users and ensure continued privacy protection.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Legal Requirements</h4>
                    <p>
                      We may disclose information when required by law, court order, or legal process, or when 
                      necessary to protect our rights, safety, or the safety of others, prevent fraud, or comply 
                      with law enforcement requests.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Platform Interactions</h4>
                    <p>
                      When you interact with establishments or promoters through our platform, certain information 
                      (such as attendance at events, preferences, and engagement metrics) may be shared with them 
                      in aggregated or anonymized form to help them improve their services.
                    </p>
                  </div>
                </section>
                
                <section className="space-y-3">
                  <h3 className="text-xl font-medium text-gray-800">4. Data Security</h3>
                  
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Technical Safeguards</h4>
                    <p>
                      We implement industry-standard security measures including data encryption in transit and at rest, 
                      secure authentication protocols, access controls, regular security audits, and monitoring for 
                      unauthorized access. Our infrastructure is hosted on secure, SOC 2 compliant platforms.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Payment Security</h4>
                    <p>
                      All payment processing is handled through Stripe's PCI DSS Level 1 compliant infrastructure. 
                      We never store complete payment card information and use tokenization for all payment-related data.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Incident Response</h4>
                    <p>
                      In the event of a data breach, we will notify affected users within 72 hours and provide 
                      detailed information about the incident, steps taken to secure data, and recommendations for users.
                    </p>
                  </div>
                </section>
                
                <section className="space-y-3">
                  <h3 className="text-xl font-medium text-gray-800">5. Your Rights and Choices</h3>
                  
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Access and Portability</h4>
                    <p>
                      You have the right to access, review, and export your personal information. Contact us to 
                      request a copy of your data in a structured, commonly used format.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Correction and Updates</h4>
                    <p>
                      You can update your profile information, preferences, and account settings at any time 
                      through your account dashboard or by contacting customer support.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Deletion and Opt-Out</h4>
                    <p>
                      You have the right to request deletion of your personal information. We will delete your 
                      data within 30 days, except where retention is required for legal compliance, ongoing 
                      transactions, or legitimate business purposes. You can opt out of marketing communications 
                      at any time.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">Consent Management</h4>
                    <p>
                      Where processing is based on consent, you can withdraw consent at any time. This will not 
                      affect the lawfulness of processing based on consent before withdrawal.
                    </p>
                  </div>
                </section>
                
                <section className="space-y-3">
                  <h3 className="text-xl font-medium text-gray-800">6. Data Retention</h3>
                  <p>
                    We retain personal information for as long as necessary to provide our services, comply with 
                    legal obligations, resolve disputes, and enforce agreements. Specific retention periods include:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Account information: Retained until account deletion plus 30 days</li>
                    <li>Transaction records: 7 years for tax and legal compliance</li>
                    <li>Analytics data: Anonymized after 2 years</li>
                    <li>Communication records: 3 years for customer support purposes</li>
                    <li>Security logs: 1 year for fraud prevention and security monitoring</li>
                  </ul>
                </section>
                
                <section className="space-y-3">
                  <h3 className="text-xl font-medium text-gray-800">7. International Data Transfers</h3>
                  <p>
                    Our services operate globally and your information may be transferred to and processed in 
                    countries other than your own. We ensure adequate protection through appropriate safeguards 
                    including standard contractual clauses, adequacy decisions, and certified frameworks.
                  </p>
                </section>
                
                <section className="space-y-3">
                  <h3 className="text-xl font-medium text-gray-800">8. Children's Privacy</h3>
                  <p>
                    Our services are not intended for individuals under the age of 21 (or the legal drinking age 
                    in your jurisdiction). We do not knowingly collect personal information from minors. If we 
                    become aware that we have collected information from a minor, we will delete it immediately.
                  </p>
                </section>
                
                <section className="space-y-3">
                  <h3 className="text-xl font-medium text-gray-800">9. Regional Privacy Rights</h3>
                  
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">GDPR (European Union)</h4>
                    <p>
                      EU residents have additional rights including the right to object to processing, right to 
                      restrict processing, and right to lodge complaints with supervisory authorities.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-800">CCPA (California)</h4>
                    <p>
                      California residents have the right to know what personal information is collected, 
                      the right to delete personal information, the right to opt-out of the sale of personal 
                      information, and the right to non-discrimination for exercising privacy rights.
                    </p>
                  </div>
                </section>
                
                <section className="space-y-3">
                  <h3 className="text-xl font-medium text-gray-800">10. Limitation of Liability</h3>
                  <p>
                    While we implement comprehensive security measures, no system is completely secure. We cannot 
                    guarantee absolute security of your information. To the extent permitted by law, we disclaim 
                    liability for unauthorized access, use, or disclosure of personal information due to factors 
                    beyond our reasonable control, including but not limited to: acts of god, government actions, 
                    network failures, hacking attempts by third parties, or user negligence in protecting account credentials.
                  </p>
                  <p className="text-sm italic">
                    Our total liability for any claims related to privacy or data protection shall not exceed 
                    the amount paid by you for our services in the 12 months preceding the claim, or $100, whichever is greater.
                  </p>
                </section>
                
                <section className="space-y-3">
                  <h3 className="text-xl font-medium text-gray-800">11. Changes to This Policy</h3>
                  <p>
                    We may update this Privacy Policy periodically to reflect changes in our practices, technology, 
                    legal requirements, or other factors. We will notify users of material changes via email or 
                    prominent notice on our platform at least 30 days before the changes take effect.
                  </p>
                </section>
                
                <section className="space-y-3">
                  <h3 className="text-xl font-medium text-gray-800">12. Contact Information</h3>
                  <p>
                    For questions about this Privacy Policy, to exercise your privacy rights, or to report privacy concerns:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Email:</strong> privacy@myxxit.com</p>
                    <p><strong>Data Protection Officer:</strong> dpo@myxxit.com</p>
                    <p><strong>Mailing Address:</strong><br />
                    Myxxit Privacy Officer<br />
                    [Your Business Address]<br />
                    [City, State, ZIP Code]</p>
                    <p className="text-sm text-gray-600 mt-3">
                      We will respond to privacy inquiries within 30 days of receipt.
                    </p>
                  </div>
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
