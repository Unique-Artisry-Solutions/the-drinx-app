
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer } from 'recharts';

interface FunnelData {
  name: string;
  value: number;
  fill: string;
  dropOffRate?: number;
}

interface FunnelVisualizationProps {
  data: FunnelData[];
}

export function FunnelVisualization({ data }: FunnelVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reward Program Funnel</CardTitle>
        <CardDescription>User progression through the rewards program</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value} users (${props.payload.dropOffRate ? props.payload.dropOffRate + '% drop' : 'starting point'})`,
                  name
                ]} 
              />
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive
              >
                <LabelList
                  position="right"
                  fill="#000"
                  stroke="none"
                  dataKey="name"
                />
                <LabelList
                  position="inside"
                  fill="#fff"
                  stroke="none"
                  dataKey="value"
                  formatter={(value: number) => `${value} users`}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
