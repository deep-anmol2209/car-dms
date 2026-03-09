"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getEndpointStats, type ApiEndpoint } from "@/lib/services/mock-api";
import { Server, Zap, Lock, CheckCircle } from "lucide-react";

interface EndpointDocsProps {
    endpoints: ApiEndpoint[];
}

export function EndpointDocs({ endpoints }: EndpointDocsProps) {
    const stats = getEndpointStats();

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-gradient hover-lift">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Endpoints
                            </CardTitle>
                            <Server className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold gradient-text">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card className="border-gradient hover-lift">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Server Actions
                            </CardTitle>
                            <Zap className="h-4 w-4 text-secondary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-secondary">{stats.serverActions}</div>
                    </CardContent>
                </Card>

                <Card className="border-gradient hover-lift">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                API Routes
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {stats.apiRoutes}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gradient hover-lift">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Authenticated
                            </CardTitle>
                            <Lock className="h-4 w-4 text-yellow-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                            {stats.authenticated}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Endpoint List */}
            <Card className="border-gradient">
                <CardHeader>
                    <CardTitle>API Documentation</CardTitle>
                    <CardDescription>
                        Complete list of all available endpoints with their specifications
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {endpoints.map((endpoint) => (
                            <div
                                key={endpoint.id}
                                className="p-4 rounded-lg border border-border/50 hover:bg-accent/5 transition-all-smooth"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold">{endpoint.name}</h4>
                                            <Badge variant="outline" className="text-xs">
                                                {endpoint.method}
                                            </Badge>
                                            {endpoint.requiresAuth && (
                                                <Badge variant="secondary" className="text-xs">
                                                    <Lock className="h-3 w-3 mr-1" />
                                                    Auth Required
                                                </Badge>
                                            )}
                                        </div>
                                        <code className="text-xs text-muted-foreground font-mono">
                                            {endpoint.path}
                                        </code>
                                    </div>
                                    <Badge
                                        variant={endpoint.category === 'Server Action' ? 'default' : 'secondary'}
                                        className="ml-2"
                                    >
                                        {endpoint.category}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
