
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '@/components/admin/AdminHeader';

interface FeatureItem {
  name: string;
  description: string;
  status: 'implemented' | 'partial' | 'planned';
  adminAccess: boolean;
  establishmentAccess: boolean;
  individualAccess: boolean;
}

const SystemFunctionalityBreakdown: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Check if user is authenticated as admin
  React.useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  // Generate CSV of all features
  const generateCSV = () => {
    // Create CSV header
    let csv = 'Feature,Description,Status,Admin Access,Establishment Access,Individual Access\n';
    
    // Add all features from all categories
    [...adminFeatures, ...establishmentFeatures, ...individualFeatures].forEach(feature => {
      const row = [
        `"${feature.name}"`,
        `"${feature.description.replace(/"/g, '""')}"`,
        feature.status,
        feature.adminAccess ? 'Yes' : 'No',
        feature.establishmentAccess ? 'Yes' : 'No',
        feature.individualAccess ? 'Yes' : 'No'
      ];
      csv += row.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'spiritless_features.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Define feature lists
  const adminFeatures: FeatureItem[] = [
    {
      name: "Admin Dashboard",
      description: "Comprehensive dashboard with overview of system metrics, user management, and content moderation tools",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: false,
      individualAccess: false
    },
    {
      name: "User Management",
      description: "View, edit, and manage all user accounts including changing user type and status",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: false,
      individualAccess: false
    },
    {
      name: "Establishment Management",
      description: "View, edit, approve, and manage all registered establishments",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: false,
      individualAccess: false
    },
    {
      name: "Mocktail Management",
      description: "Review, approve, and manage all mocktail recipes submitted across the platform",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: false,
      individualAccess: false
    },
    {
      name: "System Analytics",
      description: "Advanced analytics on user growth, engagement metrics, establishment participation, and platform usage",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: false,
      individualAccess: false
    },
    {
      name: "Content Moderation",
      description: "Review and moderate user-generated content including reviews, comments, and photos",
      status: "partial",
      adminAccess: true,
      establishmentAccess: false,
      individualAccess: false
    },
    {
      name: "Feature Toggle Management",
      description: "Enable/disable platform features and control rollout to specific user segments",
      status: "planned",
      adminAccess: true,
      establishmentAccess: false,
      individualAccess: false
    },
    {
      name: "Promotion Management",
      description: "Create, edit, and manage global promotions and featured content",
      status: "partial",
      adminAccess: true,
      establishmentAccess: false,
      individualAccess: false
    }
  ];

  const establishmentFeatures: FeatureItem[] = [
    {
      name: "Establishment Dashboard",
      description: "Dedicated dashboard showing key metrics, visitor statistics, and pending actions",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: true,
      individualAccess: false
    },
    {
      name: "Menu Management",
      description: "Create, edit, and manage mocktail menu items with ingredients, prices, and photos",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: true,
      individualAccess: false
    },
    {
      name: "Analytics",
      description: "View visitor statistics, popular drinks, revenue metrics, and customer retention data",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: true,
      individualAccess: false
    },
    {
      name: "Profile Management",
      description: "Update establishment details, hours, photos, description, and contact information",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: true,
      individualAccess: false
    },
    {
      name: "Promotion Creation",
      description: "Create and manage establishment-specific promotions and special offers",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: true,
      individualAccess: false
    },
    {
      name: "Review Response",
      description: "View and respond to customer reviews of the establishment and its mocktails",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: true,
      individualAccess: false
    },
    {
      name: "Swig Circuit Management",
      description: "Accept or decline inclusion in user-created bar crawls and manage visibility",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: true,
      individualAccess: false
    },
    {
      name: "Mocktail Suggestions",
      description: "Receive AI-powered and trend-based suggestions for new mocktail creations",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: true,
      individualAccess: false
    }
  ];

  const individualFeatures: FeatureItem[] = [
    {
      name: "Explore Mocktails",
      description: "Browse, search, and filter mocktails by ingredients, flavors, and establishments",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: true,
      individualAccess: true
    },
    {
      name: "Establishment Discovery",
      description: "Find nearby establishments with map view, filters, and search functionality",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: true,
      individualAccess: true
    },
    {
      name: "User Profile",
      description: "Manage personal profile, preferences, and account settings",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: true,
      individualAccess: true
    },
    {
      name: "Favorites Collection",
      description: "Save favorite mocktails and establishments for quick access",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: false,
      individualAccess: true
    },
    {
      name: "Rating & Reviews",
      description: "Rate and review mocktails and establishments with photos and comments",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: false,
      individualAccess: true
    },
    {
      name: "Swig Circuit Creation",
      description: "Create custom bar crawls selecting multiple establishments and drinks",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: false,
      individualAccess: true
    },
    {
      name: "Visit Tracking",
      description: "Track visited establishments and tried mocktails with personal notes",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: false,
      individualAccess: true
    },
    {
      name: "Reward Program",
      description: "Earn and redeem points for visiting establishments and trying new mocktails",
      status: "partial",
      adminAccess: true,
      establishmentAccess: false,
      individualAccess: true
    },
    {
      name: "Social Sharing",
      description: "Share favorite mocktails, establishments, and bar crawls on social media",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: true,
      individualAccess: true
    },
    {
      name: "Personal Recipe Creation",
      description: "Create and save personal mocktail recipes with ingredient lists and instructions",
      status: "implemented",
      adminAccess: true,
      establishmentAccess: false,
      individualAccess: true
    }
  ];

  const renderStatusBadge = (status: 'implemented' | 'partial' | 'planned') => {
    switch (status) {
      case 'implemented':
        return <Badge variant="default" className="bg-green-600">Implemented</Badge>;
      case 'partial':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Partial</Badge>;
      case 'planned':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Planned</Badge>;
      default:
        return null;
    }
  };

  const renderAccessIcon = (hasAccess: boolean) => {
    return hasAccess ? 
      <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-gray-300" />;
  };

  // Calculate feature statistics
  const totalFeatures = adminFeatures.length + establishmentFeatures.length + individualFeatures.length;
  const implementedFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures]
    .filter(f => f.status === 'implemented').length;
  const implementationRate = Math.round((implementedFeatures / totalFeatures) * 100);

  return (
    <div className="min-h-screen bg-material-background">
      <AdminHeader onLogout={handleLogout} />
      
      <main className="container max-w-7xl mx-auto p-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">System Functionality Breakdown</h1>
            <p className="text-gray-500">Comprehensive overview of all features for marketing and sales campaigns</p>
          </div>
          <Button onClick={generateCSV} className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export to CSV
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Implementation Overview</CardTitle>
            <CardDescription>Current status of platform features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-2xl font-bold">{totalFeatures}</div>
                <div className="text-sm text-gray-500">Total Features</div>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <div className="text-2xl font-bold text-green-700">{implementedFeatures}</div>
                <div className="text-sm text-gray-500">Implemented</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-md">
                <div className="text-2xl font-bold text-orange-600">
                  {[...adminFeatures, ...establishmentFeatures, ...individualFeatures]
                    .filter(f => f.status === 'partial').length}
                </div>
                <div className="text-sm text-gray-500">Partial</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="text-2xl font-bold text-blue-600">
                  {[...adminFeatures, ...establishmentFeatures, ...individualFeatures]
                    .filter(f => f.status === 'planned').length}
                </div>
                <div className="text-sm text-gray-500">Planned</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Implementation Progress</span>
                <span className="text-sm font-medium">{implementationRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${implementationRate}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="admin">Admin Features</TabsTrigger>
            <TabsTrigger value="establishment">Establishment Features</TabsTrigger>
            <TabsTrigger value="individual">Individual Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>Key features by user type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border p-4 rounded-md">
                    <h3 className="text-xl font-semibold mb-3 text-spiritless-pink">Admin Users</h3>
                    <ul className="space-y-2">
                      {adminFeatures.slice(0, 5).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature.name}</span>
                        </li>
                      ))}
                      {adminFeatures.length > 5 && (
                        <li className="text-sm text-gray-500 pl-6">
                          +{adminFeatures.length - 5} more features
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="text-xl font-semibold mb-3 text-spiritless-green">Establishments</h3>
                    <ul className="space-y-2">
                      {establishmentFeatures.slice(0, 5).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature.name}</span>
                        </li>
                      ))}
                      {establishmentFeatures.length > 5 && (
                        <li className="text-sm text-gray-500 pl-6">
                          +{establishmentFeatures.length - 5} more features
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="text-xl font-semibold mb-3 text-spiritless-blue">Individual Users</h3>
                    <ul className="space-y-2">
                      {individualFeatures.slice(0, 5).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature.name}</span>
                        </li>
                      ))}
                      {individualFeatures.length > 5 && (
                        <li className="text-sm text-gray-500 pl-6">
                          +{individualFeatures.length - 5} more features
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Key Platform Differentiators</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border p-4 rounded-md">
                      <h4 className="font-medium mb-2">Swig Circuits (Bar Crawls)</h4>
                      <p className="text-sm text-gray-600">
                        Our unique bar crawl feature allows users to create personalized non-alcoholic drink tours
                        across multiple establishments. Establishments can opt-in to be featured, creating a
                        win-win ecosystem for discovery and promotion.
                      </p>
                    </div>
                    <div className="border p-4 rounded-md">
                      <h4 className="font-medium mb-2">Comprehensive Analytics</h4>
                      <p className="text-sm text-gray-600">
                        Both establishments and the platform benefit from detailed analytics on visitor behavior,
                        popular drinks, and customer preferences - enabling data-driven decisions for menu optimization
                        and targeted promotions.
                      </p>
                    </div>
                    <div className="border p-4 rounded-md">
                      <h4 className="font-medium mb-2">Mocktail Community</h4>
                      <p className="text-sm text-gray-600">
                        Beyond just finding establishments, Spiritless builds a community around alcohol-free drinking
                        culture with user recipes, ratings, reviews, and social sharing capabilities.
                      </p>
                    </div>
                    <div className="border p-4 rounded-md">
                      <h4 className="font-medium mb-2">Dual-sided Marketplace</h4>
                      <p className="text-sm text-gray-600">
                        By serving both establishments and individual users with targeted features, Spiritless
                        creates network effects that increase platform value for all participants.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Features</CardTitle>
                <CardDescription>
                  Features available to system administrators for managing the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Feature</TableHead>
                      <TableHead className="w-1/2">Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>User Access</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminFeatures.map((feature, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{feature.name}</TableCell>
                        <TableCell>{feature.description}</TableCell>
                        <TableCell>{renderStatusBadge(feature.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 mb-1">Admin</span>
                              {renderAccessIcon(feature.adminAccess)}
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 mb-1">Est.</span>
                              {renderAccessIcon(feature.establishmentAccess)}
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 mb-1">User</span>
                              {renderAccessIcon(feature.individualAccess)}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="establishment">
            <Card>
              <CardHeader>
                <CardTitle>Establishment Features</CardTitle>
                <CardDescription>
                  Features available to registered establishments on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Feature</TableHead>
                      <TableHead className="w-1/2">Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>User Access</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {establishmentFeatures.map((feature, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{feature.name}</TableCell>
                        <TableCell>{feature.description}</TableCell>
                        <TableCell>{renderStatusBadge(feature.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 mb-1">Admin</span>
                              {renderAccessIcon(feature.adminAccess)}
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 mb-1">Est.</span>
                              {renderAccessIcon(feature.establishmentAccess)}
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 mb-1">User</span>
                              {renderAccessIcon(feature.individualAccess)}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="individual">
            <Card>
              <CardHeader>
                <CardTitle>Individual User Features</CardTitle>
                <CardDescription>
                  Features available to regular users of the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Feature</TableHead>
                      <TableHead className="w-1/2">Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>User Access</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {individualFeatures.map((feature, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{feature.name}</TableCell>
                        <TableCell>{feature.description}</TableCell>
                        <TableCell>{renderStatusBadge(feature.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 mb-1">Admin</span>
                              {renderAccessIcon(feature.adminAccess)}
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 mb-1">Est.</span>
                              {renderAccessIcon(feature.establishmentAccess)}
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-gray-500 mb-1">User</span>
                              {renderAccessIcon(feature.individualAccess)}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SystemFunctionalityBreakdown;
