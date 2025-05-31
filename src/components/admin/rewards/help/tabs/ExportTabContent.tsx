
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Table, Database } from 'lucide-react';

export function ExportTabContent() {
  const exportFormats = [
    {
      icon: Table,
      format: 'CSV',
      description: 'Comma-separated values for spreadsheet applications',
      useCase: 'Excel analysis, data import',
      pros: ['Universal compatibility', 'Small file size', 'Easy to edit'],
      cons: ['Limited formatting', 'No data types']
    },
    {
      icon: FileText,
      format: 'JSON',
      description: 'JavaScript Object Notation for structured data',
      useCase: 'API integration, web applications',
      pros: ['Preserves data types', 'Nested structures', 'Web-friendly'],
      cons: ['Larger file size', 'Not spreadsheet-friendly']
    },
    {
      icon: Database,
      format: 'Excel',
      description: 'Microsoft Excel format with formatting',
      useCase: 'Advanced analysis, presentations',
      pros: ['Rich formatting', 'Multiple sheets', 'Charts and formulas'],
      cons: ['Proprietary format', 'Larger files']
    }
  ];

  const exportTypes = [
    'User reward data',
    'Transaction history',
    'Tier progression',
    'Campaign performance',
    'Analytics reports',
    'System configuration'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Export your reward program data in various formats for analysis, reporting, and integration purposes.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Available Export Formats</h3>
              <div className="space-y-4">
                {exportFormats.map((format) => (
                  <Card key={format.format}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <format.icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{format.format}</h4>
                            <Badge variant="outline">{format.useCase}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {format.description}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-green-600">Pros:</span>
                              <ul className="list-disc list-inside text-muted-foreground mt-1">
                                {format.pros.map((pro) => (
                                  <li key={pro}>{pro}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="font-medium text-red-600">Cons:</span>
                              <ul className="list-disc list-inside text-muted-foreground mt-1">
                                {format.cons.map((con) => (
                                  <li key={con}>{con}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Available Data Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {exportTypes.map((type) => (
                  <Badge key={type} variant="outline" className="justify-center p-2">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
