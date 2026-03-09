import React from 'react';
import { Activity, CheckCircle2, Clock, Users, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppCard } from '../shared/app-cards';

interface Lead {
  id: string | number;
  status: string;
}

interface StatCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    description: string;
}

const StatCard = ({ title, value, icon: Icon, description }: StatCardProps) => (
  <Card className="shadow-sm border-border/60">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">
        {description}
      </p>
    </CardContent>
  </Card>
);

export const LeadStats = ({ leads }: { leads: Lead[] }) => {
  const stats = {
    total: leads.length,
    inProgress: leads.filter(l => l.status === 'In Progress').length,
    qualified: leads.filter(l => l.status === 'Qualified').length,
    new: leads.filter(l => l.status === 'New').length || 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
    <AppCard
    title='Total Leads'
    icon={Users}
    value={stats.total}
    description='total leads'
    />
   <AppCard
   title='In Progress'
   icon={Clock}
   value={stats.inProgress}
   iconColor='primary'
   description='currently active'
   />
      
      <AppCard
      title='Qualified'
      icon={CheckCircle2}
      iconColor='primary'
      value={stats.qualified}
      description='Ready for sales'
      />
      <AppCard
      title='New Leads'
      icon={Activity}
      value={stats.new}
      description='Received this week'
      />
    </div>
  );
};