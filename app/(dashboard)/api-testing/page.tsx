"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiTester } from "@/components/api-testing/api-tester";
import { EndpointDocs } from "@/components/api-testing/endpoint-docs";
import { API_ENDPOINTS, getEndpointsByCategory, getEndpointStats } from "@/lib/services/mock-api";
import { FlaskConical, BookOpen, Zap, Globe, CheckCircle2, Activity, Sparkles } from "lucide-react";

export default function ApiTestingPage() {
    const [activeTab, setActiveTab] = useState("all");

    const serverActions = getEndpointsByCategory("Server Action");
    const apiRoutes = getEndpointsByCategory("API Route");
    const stats = getEndpointStats();

    return (
        <div className="flex-1 space-y-8 p-8 animate-in fade-in slide-in-from-bottom">
            {/* Dramatic Header with Gradient Background */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 shadow-elevated-lg">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                </div>

                <div className="relative z-10 flex items-start gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-glow border border-white/20 animate-in bounce-in">
                        <FlaskConical className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-5xl font-bold text-white tracking-tight">
                                API Testing Dashboard
                            </h1>
                            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm animate-in scale-in">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Live
                            </Badge>
                        </div>
                        <p className="text-white/90 text-lg mb-4">
                            Test and verify all endpoints with real-time dummy API responses
                        </p>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                <Activity className="h-4 w-4 text-white" />
                                <span className="text-white font-semibold">{stats.total}</span>
                                <span className="text-white/80 text-sm">Total Endpoints</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                <Zap className="h-4 w-4 text-white" />
                                <span className="text-white font-semibold">{stats.serverActions}</span>
                                <span className="text-white/80 text-sm">Server Actions</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                <Globe className="h-4 w-4 text-white" />
                                <span className="text-white font-semibold">{stats.apiRoutes}</span>
                                <span className="text-white/80 text-sm">API Routes</span>
                            </div>
                            <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-green-400/30">
                                <CheckCircle2 className="h-4 w-4 text-green-300" />
                                <span className="text-white font-semibold">All Systems</span>
                                <span className="text-green-300 text-sm">Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-card border border-border shadow-md h-14">
                    <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
                        <Globe className="h-4 w-4" />
                        <span className="hidden sm:inline">All Endpoints</span>
                        <Badge variant="secondary" className="ml-1">
                            {API_ENDPOINTS.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="server-actions" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
                        <Zap className="h-4 w-4" />
                        <span className="hidden sm:inline">Server Actions</span>
                        <Badge variant="secondary" className="ml-1">
                            {serverActions.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="api-routes" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
                        <Globe className="h-4 w-4" />
                        <span className="hidden sm:inline">API Routes</span>
                        <Badge variant="secondary" className="ml-1">
                            {apiRoutes.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">Documentation</span>
                    </TabsTrigger>
                </TabsList>

                {/* All Endpoints */}
                <TabsContent value="all" className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                                <Globe className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold gradient-text">All Endpoints ({API_ENDPOINTS.length})</h2>
                                <p className="text-muted-foreground text-sm">Complete list of server actions and API routes</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {API_ENDPOINTS.map((endpoint, index) => (
                                <div key={endpoint.id} className="animate-in fade-in slide-in-from-bottom" style={{ animationDelay: `${index * 50}ms` }}>
                                    <ApiTester endpoint={endpoint} />
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Server Actions */}
                <TabsContent value="server-actions" className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-glow">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold gradient-text">Server Actions ({serverActions.length})</h2>
                                <p className="text-muted-foreground text-sm">Next.js server actions for server-side data operations</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {serverActions.map((endpoint, index) => (
                                <div key={endpoint.id} className="animate-in fade-in slide-in-from-left" style={{ animationDelay: `${index * 50}ms` }}>
                                    <ApiTester endpoint={endpoint} />
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* API Routes */}
                <TabsContent value="api-routes" className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-glow">
                                <Globe className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold gradient-text">API Routes ({apiRoutes.length})</h2>
                                <p className="text-muted-foreground text-sm">RESTful API endpoints for external integrations</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {apiRoutes.map((endpoint, index) => (
                                <div key={endpoint.id} className="animate-in fade-in slide-in-from-right" style={{ animationDelay: `${index * 50}ms` }}>
                                    <ApiTester endpoint={endpoint} />
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Documentation */}
                <TabsContent value="docs" className="space-y-6 animate-in fade-in">
                    <EndpointDocs endpoints={API_ENDPOINTS} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
