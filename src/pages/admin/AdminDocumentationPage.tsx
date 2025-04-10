
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import DocSectionCard from '@/components/admin/documentation/DocSectionCard';
import { featureSections } from '@/components/admin/documentation/docData';
import DocFeatureDetails from '@/components/admin/documentation/DocFeatureDetails';
import DocSearch from '@/components/admin/documentation/DocSearch';

const AdminDocumentationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // Handle feature selection
  const handleFeatureSelect = (featureId: string) => {
    setSelectedFeature(featureId);
  };

  // Handle back navigation from feature details
  const handleBackToList = () => {
    setSelectedFeature(null);
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Documentation</h1>
          <p className="text-gray-600 mb-6">
            Comprehensive guide to all features and functionality within the admin suite
          </p>
          
          {!selectedFeature && (
            <DocSearch 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
          )}
        </header>

        {selectedFeature ? (
          <DocFeatureDetails 
            featureId={selectedFeature} 
            onBack={handleBackToList} 
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-6 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users & Access</TabsTrigger>
              <TabsTrigger value="content">Content Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">System Settings</TabsTrigger>
              <TabsTrigger value="tools">Tools & Utilities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureSections
                  .filter(section => searchQuery === '' || 
                    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    section.features.some(f => 
                      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      f.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  )
                  .map(section => (
                    <DocSectionCard 
                      key={section.id}
                      section={section}
                      onFeatureSelect={handleFeatureSelect}
                      filterQuery={searchQuery}
                    />
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureSections
                  .filter(section => section.category === 'users')
                  .filter(section => searchQuery === '' || 
                    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    section.features.some(f => 
                      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      f.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  )
                  .map(section => (
                    <DocSectionCard 
                      key={section.id}
                      section={section}
                      onFeatureSelect={handleFeatureSelect}
                      filterQuery={searchQuery}
                    />
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureSections
                  .filter(section => section.category === 'content')
                  .filter(section => searchQuery === '' || 
                    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    section.features.some(f => 
                      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      f.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  )
                  .map(section => (
                    <DocSectionCard 
                      key={section.id}
                      section={section}
                      onFeatureSelect={handleFeatureSelect}
                      filterQuery={searchQuery}
                    />
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureSections
                  .filter(section => section.category === 'analytics')
                  .filter(section => searchQuery === '' || 
                    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    section.features.some(f => 
                      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      f.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  )
                  .map(section => (
                    <DocSectionCard 
                      key={section.id}
                      section={section}
                      onFeatureSelect={handleFeatureSelect}
                      filterQuery={searchQuery}
                    />
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureSections
                  .filter(section => section.category === 'settings')
                  .filter(section => searchQuery === '' || 
                    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    section.features.some(f => 
                      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      f.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  )
                  .map(section => (
                    <DocSectionCard 
                      key={section.id}
                      section={section}
                      onFeatureSelect={handleFeatureSelect}
                      filterQuery={searchQuery}
                    />
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="tools" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureSections
                  .filter(section => section.category === 'tools')
                  .filter(section => searchQuery === '' || 
                    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    section.features.some(f => 
                      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      f.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  )
                  .map(section => (
                    <DocSectionCard 
                      key={section.id}
                      section={section}
                      onFeatureSelect={handleFeatureSelect}
                      filterQuery={searchQuery}
                    />
                  ))
                }
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default AdminDocumentationPage;
