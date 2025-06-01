
import React from 'react';
import { ArrowLeft, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getFeatureById } from './docData';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DocFeatureDetailsProps {
  featureId: string;
  onBack: () => void;
}

const DocFeatureDetails: React.FC<DocFeatureDetailsProps> = ({ featureId, onBack }) => {
  const feature = getFeatureById(featureId);
  
  if (!feature) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Feature not found</h3>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to documentation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to documentation
        </Button>
        {feature.externalUrl && (
          <Button variant="ghost" size="sm" asChild>
            <a href={feature.externalUrl} target="_blank" rel="noopener noreferrer">
              Open in new tab <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{feature.title}</h1>
          <div className="flex items-center mt-2 space-x-2">
            <Badge variant="outline">{feature.category}</Badge>
            {feature.status === 'implemented' && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">Implemented</Badge>
            )}
            {feature.status === 'partial' && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Partially Implemented</Badge>
            )}
            {feature.status === 'planned' && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">Planned</Badge>
            )}
          </div>
          <p className="text-gray-600 mt-4 text-lg">{feature.description}</p>
        </div>

        {feature.screenshot && (
          <Card className="overflow-hidden p-2 bg-gray-50 border border-gray-200">
            <div className="aspect-video relative bg-white rounded shadow-sm">
              {/* Placeholder for screenshots - would be replaced with actual images */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <p>Screenshot: {feature.title}</p>
                {/* Replace with: <img src={feature.screenshot} alt={feature.title} className="w-full h-full object-cover" /> */}
              </div>
            </div>
            {feature.screenshotCaption && (
              <p className="text-sm text-gray-500 mt-2 text-center">{feature.screenshotCaption}</p>
            )}
          </Card>
        )}

        {feature.quickTips && feature.quickTips.length > 0 && (
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Quick Tips</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {feature.quickTips.map((tip, index) => (
                  <li key={index} className="text-sm">{tip}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Accordion type="single" collapsible className="w-full">
          {feature.steps && feature.steps.length > 0 && (
            <AccordionItem value="steps">
              <AccordionTrigger>Step-by-Step Guide</AccordionTrigger>
              <AccordionContent>
                <ol className="space-y-4 list-decimal pl-5">
                  {feature.steps.map((step, index) => (
                    <li key={index} className="pl-2">
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-gray-600 mt-1">{step.description}</p>
                      {step.screenshot && (
                        <div className="mt-2 border border-gray-200 rounded overflow-hidden">
                          {/* Placeholder for step screenshots */}
                          <div className="h-40 bg-gray-50 flex items-center justify-center text-gray-400">
                            Step {index + 1} Screenshot
                            {/* Replace with: <img src={step.screenshot} alt={step.title} className="w-full h-full object-contain" /> */}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {feature.bestPractices && feature.bestPractices.length > 0 && (
            <AccordionItem value="best-practices">
              <AccordionTrigger>Best Practices</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 list-disc pl-5">
                  {feature.bestPractices.map((practice, index) => (
                    <li key={index} className="pl-1">{practice}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {feature.troubleshooting && feature.troubleshooting.length > 0 && (
            <AccordionItem value="troubleshooting">
              <AccordionTrigger>Troubleshooting</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {feature.troubleshooting.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-red-600">{item.problem}</h4>
                      <p className="mt-1">{item.solution}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {feature.faq && feature.faq.length > 0 && (
            <AccordionItem value="faq">
              <AccordionTrigger>Frequently Asked Questions</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {feature.faq.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-medium">{item.question}</h4>
                      <p className="mt-1 text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {feature.relatedFeatures && feature.relatedFeatures.length > 0 && (
            <AccordionItem value="related">
              <AccordionTrigger>Related Features</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {feature.relatedFeatures.map(relatedId => {
                    const related = getFeatureById(relatedId);
                    return related ? (
                      <li key={relatedId} className="p-2 bg-gray-50 rounded-md">
                        <h4 className="font-medium">{related.title}</h4>
                        <p className="text-sm text-gray-500">{related.description}</p>
                      </li>
                    ) : null;
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
};

export default DocFeatureDetails;
