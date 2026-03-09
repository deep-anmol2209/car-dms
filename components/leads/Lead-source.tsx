"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart } from 'lucide-react';

const CustomBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} />
    </g>
  );
};

export const LeadSource = ({ leads }: { leads: any[] }) => {
  const dataMap = leads.reduce((acc: any, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(dataMap).map(key => ({ name: key, value: dataMap[key] }));
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#6366f1', '#ec4899']; // Emerald, Blue, Amber, Indigo, Pink

  return (
    <Card className="shadow-sm border-border/60 h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-muted-foreground"/>
            <CardTitle className="text-base">Sources</CardTitle>
        </div>
        <CardDescription>Where your leads are coming from.</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
              contentStyle={{ 
                  borderRadius: '8px', 
                  border: '1px solid hsl(var(--border))', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backgroundColor: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))'
              }}
            />
            <Bar dataKey="value" shape={<CustomBar />}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};