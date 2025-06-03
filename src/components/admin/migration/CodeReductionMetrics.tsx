
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, FileText, CheckCircle, Clock } from 'lucide-react';
import { useAdminCodeReduction, type PageMetrics } from '@/hooks/admin/useAdminCodeReduction';

const getStatusIcon = (status: PageMetrics['status']) => {
  switch (status) {
    case 'migrated':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'optimized':
      return <CheckCircle className="h-4 w-4 text-blue-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusColor = (status: PageMetrics['status']) => {
  switch (status) {
    case 'migrated':
      return 'bg-green-100 text-green-800';
    case 'optimized':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const CodeReductionMetrics: React.FC = () => {
  const { pageMetrics, overallMetrics, projectedReduction } = useAdminCodeReduction();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lines Reduced</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {overallMetrics.reducedLines}
            </div>
            <p className="text-xs text-gray-600">
              {overallMetrics.reductionPercentage}% reduction achieved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Reduction</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {projectedReduction.totalReduction}
            </div>
            <p className="text-xs text-gray-600">
              {projectedReduction.projectedPercentage}% when complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Codebase</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallMetrics.totalLines}
            </div>
            <p className="text-xs text-gray-600">
              lines in admin pages
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page-by-Page Reduction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pageMetrics.map((page) => (
              <div key={page.pageName} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(page.status)}
                    <span className="font-medium">{page.pageName}</span>
                    <Badge className={getStatusColor(page.status)}>
                      {page.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    -{page.reduction} lines ({page.reductionPercentage}%)
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Before: {page.beforeLines} lines</span>
                  <span>After: {page.afterLines} lines</span>
                </div>
                <Progress 
                  value={page.status === 'pending' ? 0 : page.reductionPercentage} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeReductionMetrics;
