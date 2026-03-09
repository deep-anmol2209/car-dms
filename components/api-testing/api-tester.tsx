"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { executeMockApi, type ApiEndpoint } from "@/lib/services/mock-api";
import { Play, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiTesterProps {
    endpoint: ApiEndpoint;
}

export function ApiTester({ endpoint }: ApiTesterProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        data?: any;
        error?: string;
        executionTime: number;
    } | null>(null);

    const handleTest = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await executeMockApi(endpoint.id, endpoint.requestExample);
            setResult(response);
        } catch (error: any) {
            setResult({
                success: false,
                error: error.message || 'Unknown error occurred',
                executionTime: 0,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="hover-lift border-gradient overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />

            <CardHeader className="relative z-10">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                            <Badge
                                variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                                className={cn(
                                    "text-xs",
                                    endpoint.method === 'GET' && "bg-green-500/10 text-green-700 dark:text-green-400",
                                    endpoint.method === 'POST' && "bg-blue-500/10 text-blue-700 dark:text-blue-400",
                                    endpoint.method === 'PUT' && "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                                    endpoint.method === 'DELETE' && "bg-red-500/10 text-red-700 dark:text-red-400"
                                )}
                            >
                                {endpoint.method}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                {endpoint.category}
                            </Badge>
                        </div>
                        <CardDescription>{endpoint.description}</CardDescription>
                        <code className="text-xs bg-muted px-2 py-1 rounded block mt-2 font-mono">
                            {endpoint.path}
                        </code>
                    </div>

                    <Button
                        onClick={handleTest}
                        disabled={isLoading}
                        size="sm"
                        className="gradient-primary hover:shadow-glow transition-all-smooth"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Testing...
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-2" />
                                Test
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-4">
                {/* Request Example */}
                {endpoint.requestExample && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">Request Example</h4>
                        <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto border border-border/50">
                            {JSON.stringify(endpoint.requestExample, null, 2)}
                        </pre>
                    </div>
                )}

                {/* Response Example */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">Expected Response</h4>
                    <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto border border-border/50">
                        {JSON.stringify(endpoint.responseExample, null, 2)}
                    </pre>
                </div>

                {/* Test Result */}
                {result && (
                    <div
                        className={cn(
                            "space-y-2 p-4 rounded-lg border-2 animate-in slide-in-from-bottom",
                            result.success
                                ? "bg-green-500/10 border-green-500/50"
                                : "bg-red-500/10 border-red-500/50"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {result.success ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                )}
                                <h4 className="text-sm font-semibold">
                                    {result.success ? 'Test Passed' : 'Test Failed'}
                                </h4>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {result.executionTime}ms
                            </div>
                        </div>

                        {result.error && (
                            <p className="text-sm text-red-600 dark:text-red-400">{result.error}</p>
                        )}

                        {result.data && (
                            <div className="space-y-1">
                                <h5 className="text-xs font-semibold text-muted-foreground">Actual Response</h5>
                                <pre className="text-xs bg-background/50 p-3 rounded border border-border/50 overflow-x-auto">
                                    {JSON.stringify(result.data, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
