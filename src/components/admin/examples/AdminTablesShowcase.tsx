
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EstablishmentsAdminTable } from './EstablishmentsAdminTable';
import { CocktailsAdminTable } from './CocktailsAdminTable';
import { UsersAdminTable } from './UsersAdminTable';
import { Building2, Wine, Users } from 'lucide-react';

export const AdminTablesShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('establishments');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Admin Data Management</h2>
        <p className="text-muted-foreground">
          Unified admin tables with consistent APIs and reusable components
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="establishments" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Establishments
          </TabsTrigger>
          <TabsTrigger value="cocktails" className="flex items-center gap-2">
            <Wine className="h-4 w-4" />
            Cocktails
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="establishments" className="mt-6">
          <EstablishmentsAdminTable />
        </TabsContent>

        <TabsContent value="cocktails" className="mt-6">
          <CocktailsAdminTable />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UsersAdminTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};
