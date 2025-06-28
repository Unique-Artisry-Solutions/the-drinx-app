
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { User, Store, Megaphone, Users } from 'lucide-react';

interface TestUser {
  email: string;
  password: string;
  name: string;
  username: string;
  userType: 'individual' | 'establishment' | 'promoter' | 'admin';
  phone: string;
  additionalData?: any;
}

const TEST_USERS: TestUser[] = [
  // Individual Users
  {
    email: 'alice@test.com',
    password: 'Test123!',
    name: 'Alice Johnson',
    username: 'alice_j',
    userType: 'individual',
    phone: '555-0001'
  },
  {
    email: 'bob@test.com',
    password: 'Test123!',
    name: 'Bob Smith',
    username: 'bob_s',
    userType: 'individual',
    phone: '555-0002'
  },
  {
    email: 'charlie@test.com',
    password: 'Test123!',
    name: 'Charlie Brown',
    username: 'charlie_b',
    userType: 'individual',
    phone: '555-0003'
  },
  
  // Establishment Users
  {
    email: 'downtown_bar@test.com',
    password: 'Test123!',
    name: 'Downtown Bar & Grill',
    username: 'downtown_bar',
    userType: 'establishment',
    phone: '555-1001',
    additionalData: {
      establishmentName: 'Downtown Bar & Grill',
      address: '123 Main St, Downtown',
      capacity: 150
    }
  },
  {
    email: 'rooftop_lounge@test.com',
    password: 'Test123!',
    name: 'Rooftop Lounge',
    username: 'rooftop_lounge',
    userType: 'establishment',
    phone: '555-1002',
    additionalData: {
      establishmentName: 'Rooftop Lounge',
      address: '456 High St, Uptown',
      capacity: 200
    }
  },
  {
    email: 'craft_brewery@test.com',
    password: 'Test123!',
    name: 'Craft Brewery Co',
    username: 'craft_brewery',
    userType: 'establishment',
    phone: '555-1003',
    additionalData: {
      establishmentName: 'Craft Brewery Co',
      address: '789 Brewery Lane',
      capacity: 100
    }
  },
  
  // Promoter Users
  {
    email: 'party_promoter@test.com',
    password: 'Test123!',
    name: 'Party Events Pro',
    username: 'party_promoter',
    userType: 'promoter',
    phone: '555-2001',
    additionalData: {
      company: 'Party Events Pro',
      specialties: ['Nightlife', 'Corporate Events']
    }
  },
  {
    email: 'event_master@test.com',
    password: 'Test123!',
    name: 'Event Master',
    username: 'event_master',
    userType: 'promoter',
    phone: '555-2002',
    additionalData: {
      company: 'Event Master LLC',
      specialties: ['Bar Crawls', 'Special Events']
    }
  },
  
  // Admin User
  {
    email: 'admin@spiritless.com',
    password: 'Admin123!',
    name: 'System Administrator',
    username: 'admin',
    userType: 'admin',
    phone: '555-9999'
  }
];

const TestUserManager: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [createdUsers, setCreatedUsers] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const createTestUser = async (user: TestUser) => {
    try {
      const response = await supabase.functions.invoke('create_test_user', {
        body: {
          email: user.email,
          password: user.password,
          name: user.name,
          username: user.username,
          userType: user.userType,
          phone: user.phone,
          additionalData: user.additionalData
        }
      });

      if (response.error) throw response.error;

      setCreatedUsers(prev => new Set([...prev, user.email]));
      
      toast({
        title: "User Created",
        description: `${user.name} (${user.userType}) created successfully`
      });

      return true;
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Creation Failed",
        description: error.message || `Failed to create ${user.name}`,
        variant: "destructive"
      });
      return false;
    }
  };

  const createAllUsers = async () => {
    setIsCreating(true);
    let successCount = 0;
    
    for (const user of TEST_USERS) {
      const success = await createTestUser(user);
      if (success) successCount++;
      // Small delay between creations
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsCreating(false);
    toast({
      title: "Batch Creation Complete",
      description: `Successfully created ${successCount}/${TEST_USERS.length} test users`
    });
  };

  const createUsersByType = async (userType: string) => {
    setIsCreating(true);
    const usersOfType = TEST_USERS.filter(user => user.userType === userType);
    let successCount = 0;
    
    for (const user of usersOfType) {
      const success = await createTestUser(user);
      if (success) successCount++;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsCreating(false);
    toast({
      title: `${userType} Users Created`,
      description: `Successfully created ${successCount}/${usersOfType.length} ${userType} users`
    });
  };

  const getUserIcon = (userType: string) => {
    switch (userType) {
      case 'individual': return <User className="h-4 w-4" />;
      case 'establishment': return <Store className="h-4 w-4" />;
      case 'promoter': return <Megaphone className="h-4 w-4" />;
      case 'admin': return <Users className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getUsersByType = (userType: string) => 
    TEST_USERS.filter(user => user.userType === userType);

  const copyCredentials = (user: TestUser) => {
    const credentials = `Email: ${user.email}\nPassword: ${user.password}`;
    navigator.clipboard.writeText(credentials);
    toast({
      title: "Credentials Copied",
      description: `${user.name}'s login credentials copied to clipboard`
    });
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Test User Management System
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={createAllUsers} 
            disabled={isCreating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isCreating ? 'Creating...' : 'Create All Test Users'}
          </Button>
          <Button 
            onClick={() => createUsersByType('individual')} 
            disabled={isCreating}
            variant="outline"
          >
            Create Individuals
          </Button>
          <Button 
            onClick={() => createUsersByType('establishment')} 
            disabled={isCreating}
            variant="outline"
          >
            Create Establishments
          </Button>
          <Button 
            onClick={() => createUsersByType('promoter')} 
            disabled={isCreating}
            variant="outline"
          >
            Create Promoters
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Users ({TEST_USERS.length})</TabsTrigger>
            <TabsTrigger value="individual">
              Individuals ({getUsersByType('individual').length})
            </TabsTrigger>
            <TabsTrigger value="establishment">
              Establishments ({getUsersByType('establishment').length})
            </TabsTrigger>
            <TabsTrigger value="promoter">
              Promoters ({getUsersByType('promoter').length})
            </TabsTrigger>
            <TabsTrigger value="admin">
              Admin ({getUsersByType('admin').length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {TEST_USERS.map((user) => (
                <Card key={user.email} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getUserIcon(user.userType)}
                        <Badge variant="secondary">{user.userType}</Badge>
                      </div>
                      {createdUsers.has(user.email) && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Created
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                    
                    {user.additionalData && (
                      <div className="mt-2 text-xs text-gray-500">
                        {user.userType === 'establishment' && (
                          <div>
                            <p>{user.additionalData.establishmentName}</p>
                            <p>{user.additionalData.address}</p>
                            <p>Capacity: {user.additionalData.capacity}</p>
                          </div>
                        )}
                        {user.userType === 'promoter' && (
                          <div>
                            <p>{user.additionalData.company}</p>
                            <p>Specialties: {user.additionalData.specialties?.join(', ')}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        onClick={() => createTestUser(user)}
                        disabled={isCreating}
                        className="flex-1"
                      >
                        Create
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyCredentials(user)}
                      >
                        Copy Login
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {['individual', 'establishment', 'promoter', 'admin'].map((userType) => (
            <TabsContent key={userType} value={userType}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getUsersByType(userType).map((user) => (
                  <Card key={user.email} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getUserIcon(user.userType)}
                          <Badge variant="secondary">{user.userType}</Badge>
                        </div>
                        {createdUsers.has(user.email) && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Created
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.phone}</p>
                      
                      {user.additionalData && (
                        <div className="mt-2 text-xs text-gray-500">
                          {user.userType === 'establishment' && (
                            <div>
                              <p>{user.additionalData.establishmentName}</p>
                              <p>{user.additionalData.address}</p>
                              <p>Capacity: {user.additionalData.capacity}</p>
                            </div>
                          )}
                          {user.userType === 'promoter' && (
                            <div>
                              <p>{user.additionalData.company}</p>
                              <p>Specialties: {user.additionalData.specialties?.join(', ')}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          onClick={() => createTestUser(user)}
                          disabled={isCreating}
                          className="flex-1"
                        >
                          Create
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyCredentials(user)}
                        >
                          Copy Login
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TestUserManager;
