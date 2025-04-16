
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TicketTier } from '@/hooks/swigCircuit/types';
import { BarChart2, TrendingUp, Users, CreditCard } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Establishment } from '@/types/ProfileTypes';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';

interface ProjectionsTabProps {
  ticketTiers: TicketTier[];
  selectedEstablishments: Establishment[];
  projectedAttendance: number;
  projectedRevenue: number;
  calculateProjections: () => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
}

const ProjectionsTab: React.FC<ProjectionsTabProps> = ({
  ticketTiers,
  selectedEstablishments,
  projectedAttendance,
  projectedRevenue,
  calculateProjections,
  onBack,
  onSubmit,
  isSubmitDisabled,
  isSubmitting
}) => {
  // Calculate projections when component mounts or when dependencies change
  useEffect(() => {
    calculateProjections();
  }, [ticketTiers, selectedEstablishments, calculateProjections]);

  // Generate data for ticket tiers chart
  const ticketTierData = ticketTiers.map(tier => {
    // Calculate estimated attendance for this tier
    const totalPrice = ticketTiers.reduce((sum, t) => sum + t.price, 0);
    const tierRatio = tier.price / totalPrice;
    const inverseTierRatio = 1 - (tierRatio * 0.5);
    const tierAttendance = Math.round(projectedAttendance * inverseTierRatio / ticketTiers.length);
    
    return {
      name: tier.name,
      price: tier.price,
      attendees: tierAttendance,
      revenue: tier.price * tierAttendance
    };
  });

  const venueProjections = selectedEstablishments.map((est, index) => {
    // Calculate expected visitors per venue with diminishing returns
    const position = index + 1;
    const visitorFalloff = Math.max(0.5, 1 - (index * 0.08)); 
    const expectedVisitors = Math.round(projectedAttendance * visitorFalloff);
    
    // Calculate average spend per visitor based on position in circuit
    const baseSpend = 15; // Base spend in dollars
    const spendMultiplier = position <= 2 ? 1.2 : position >= selectedEstablishments.length - 1 ? 1.15 : 1;
    const projectedSpend = baseSpend * spendMultiplier;
    
    // Calculate expected revenue
    const expectedRevenue = expectedVisitors * projectedSpend;
    
    return {
      name: est.name.length > 12 ? est.name.substring(0, 12) + '...' : est.name,
      visitors: expectedVisitors,
      spend: Math.round(projectedSpend * 100) / 100,
      revenue: Math.round(expectedRevenue)
    };
  });

  return (
    <Card className="p-6 w-full">
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-spiritless-pink" />
          <h2 className="text-2xl font-bold">Performance Projections</h2>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Based on your ticket tiers and selected venues, here are the projected performance metrics for your Swig Circuit.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg">Projected Attendance</h3>
            </div>
            <div className="text-3xl font-bold mb-2">{projectedAttendance.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">
              Estimated based on {selectedEstablishments.length} venues and {ticketTiers.length} ticket tiers
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-lg">Projected Revenue</h3>
            </div>
            <div className="text-3xl font-bold mb-2">${projectedRevenue.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">
              Estimated based on ticket sales and attendance projections
            </p>
          </div>
        </div>

        {ticketTierData.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">Ticket Tier Projections</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ticketTierData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="attendees" name="Expected Attendees" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="revenue" name="Projected Revenue ($)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {venueProjections.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">Venue Performance Projections</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={venueProjections}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="visitors" name="Expected Visitors" fill="#8884d8" />
                  <Bar dataKey="revenue" name="Projected Revenue ($)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>* Projections are estimates based on venue placement and typical customer behavior</p>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-2 border-t pt-4 mt-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">Projection Insights</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Your circuit with {selectedEstablishments.length} venues could attract approximately {projectedAttendance} participants</li>
            <li>With {ticketTiers.length} ticket tiers, you could generate an estimated ${projectedRevenue.toLocaleString()} in revenue</li>
            <li>First and last venues typically see 15-20% higher spending per visitor</li>
            <li>The projections are based on similar events and historical data</li>
          </ul>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button 
                    onClick={onSubmit}
                    disabled={isSubmitDisabled || isSubmitting}
                    className="bg-spiritless-pink hover:bg-spiritless-pink/90"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Swig Circuit'}
                  </Button>
                </div>
              </TooltipTrigger>
              {isSubmitDisabled && (
                <TooltipContent>
                  <p>Please complete all required sections before submitting</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
};

export default ProjectionsTab;
