// Mock API Service for Testing All Endpoints
// This provides dummy data responses for all server actions and API routes

export interface ApiEndpoint {
    id: string;
    name: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    description: string;
    category: 'Server Action' | 'API Route';
    requiresAuth: boolean;
    requestExample?: any;
    responseExample?: any;
}

export const API_ENDPOINTS: ApiEndpoint[] = [
    // Dashboard Stats
    {
        id: 'getDashboardStats',
        name: 'Get Dashboard Stats',
        method: 'GET',
        path: 'getDashboardStats()',
        description: 'Fetches key performance indicators for the dashboard',
        category: 'Server Action',
        requiresAuth: true,
        responseExample: {
            total_inventory_count: 45,
            total_inventory_value: 1250000,
            projected_profit: 185000,
            leads_this_month: 28,
        },
    },
    {
        id: 'getInventoryStats',
        name: 'Get Inventory Stats',
        method: 'GET',
        path: 'getInventoryStats()',
        description: 'Returns inventory breakdown by status',
        category: 'Server Action',
        requiresAuth: true,
        responseExample: [
            { status: 'Active', count: 32 },
            { status: 'Sold', count: 156 },
            { status: 'Inactive', count: 8 },
        ],
    },
    {
        id: 'getRevenueData',
        name: 'Get Revenue Data',
        method: 'GET',
        path: 'getRevenueData()',
        description: 'Returns monthly revenue trends for charts',
        category: 'Server Action',
        requiresAuth: true,
        responseExample: [
            { month: 'Jan', revenue: 125000 },
            { month: 'Feb', revenue: 145000 },
            { month: 'Mar', revenue: 168000 },
            { month: 'Apr', revenue: 152000 },
            { month: 'May', revenue: 178000 },
            { month: 'Jun', revenue: 195000 },
        ],
    },
    {
        id: 'getRecentLeads',
        name: 'Get Recent Leads',
        method: 'GET',
        path: 'getRecentLeads(limit)',
        description: 'Fetches most recent leads with customer info',
        category: 'Server Action',
        requiresAuth: true,
        requestExample: { limit: 5 },
        responseExample: [
            {
                id: '1',
                status: 'In Progress',
                created_at: '2024-01-15T10:30:00Z',
                customer: { name: 'John Smith', phone: '555-0123' },
            },
            {
                id: '2',
                status: 'Qualified',
                created_at: '2024-01-14T15:45:00Z',
                customer: { name: 'Sarah Johnson', phone: '555-0456' },
            },
        ],
    },

    // Financial Actions
    {
        id: 'getFinancialTransactions',
        name: 'Get Financial Transactions',
        method: 'GET',
        path: 'getFinancialTransactions()',
        description: 'Returns financial ledger with sales and expenses',
        category: 'Server Action',
        requiresAuth: true,
        responseExample: [
            {
                id: 'sale-1',
                date: '2024-01-15T10:00:00Z',
                type: 'sale',
                description: '2022 Honda Civic (VIN: ABC123)',
                amount: 25000,
            },
            {
                id: 'expense-1',
                date: '2024-01-10T14:30:00Z',
                type: 'expense',
                description: 'Vehicle Purchase: Toyota Camry (XYZ789)',
                amount: 18000,
            },
        ],
    },

    // System Health
    {
        id: 'checkDatabaseIntegrity',
        name: 'Check Database Integrity',
        method: 'GET',
        path: 'checkDatabaseIntegrity()',
        description: 'Performs system health checks on all database tables',
        category: 'Server Action',
        requiresAuth: true,
        responseExample: {
            inventory: 'OK',
            crm: 'OK',
            finance: 'OK',
            latency: '45ms',
            orphanLeads: 0,
            orphanTestDrives: 0,
            corruptedRecords: 0,
        },
    },
    {
        id: 'getTableCounts',
        name: 'Get Table Counts',
        method: 'GET',
        path: 'getTableCounts()',
        description: 'Returns record counts for all database tables',
        category: 'Server Action',
        requiresAuth: true,
        responseExample: {
            vehicles: 196,
            leads: 342,
            invoices: 156,
            users: 12,
            test_drives: 89,
            sales_deals: 156,
        },
    },

    // API Routes
    {
        id: 'apiChat',
        name: 'AI Chat',
        method: 'POST',
        path: '/api/chat',
        description: 'AI-powered chat assistant (currently disabled)',
        category: 'API Route',
        requiresAuth: true,
        requestExample: {
            messages: [
                { role: 'user', content: 'How many vehicles do we have in stock?' },
            ],
        },
        responseExample: {
            error: 'AI chat temporarily disabled - being fixed',
        },
    },
    {
        id: 'apiCronCleanup',
        name: 'Cron: Cleanup Leads',
        method: 'POST',
        path: '/api/cron/cleanup-leads',
        description: 'Automated job to mark stale leads as lost',
        category: 'API Route',
        requiresAuth: true,
        requestExample: {},
        responseExample: {
            success: true,
            message: "Updated 5 stale leads to 'Lost' status",
            updated: 5,
        },
    },
    {
        id: 'apiFacebookPost',
        name: 'Facebook Post',
        method: 'POST',
        path: '/api/facebook/post',
        description: 'Posts a vehicle to Facebook Marketplace',
        category: 'API Route',
        requiresAuth: true,
        requestExample: {
            vehicleId: 'vehicle-123',
        },
        responseExample: {
            success: true,
            postId: 'fb-post-456',
            message: 'Successfully posted to Facebook',
        },
    },
];

// Mock API execution function
export async function executeMockApi(endpointId: string, params?: any): Promise<{
    success: boolean;
    data?: any;
    error?: string;
    executionTime: number;
}> {
    const startTime = Date.now();

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

    const endpoint = API_ENDPOINTS.find(e => e.id === endpointId);

    if (!endpoint) {
        return {
            success: false,
            error: 'Endpoint not found',
            executionTime: Date.now() - startTime,
        };
    }

    // Simulate occasional errors (10% chance)
    if (Math.random() < 0.1) {
        return {
            success: false,
            error: 'Simulated network error - please retry',
            executionTime: Date.now() - startTime,
        };
    }

    return {
        success: true,
        data: endpoint.responseExample,
        executionTime: Date.now() - startTime,
    };
}

// Get endpoints by category
export function getEndpointsByCategory(category: 'Server Action' | 'API Route') {
    return API_ENDPOINTS.filter(e => e.category === category);
}

// Get endpoint statistics
export function getEndpointStats() {
    return {
        total: API_ENDPOINTS.length,
        serverActions: API_ENDPOINTS.filter(e => e.category === 'Server Action').length,
        apiRoutes: API_ENDPOINTS.filter(e => e.category === 'API Route').length,
        authenticated: API_ENDPOINTS.filter(e => e.requiresAuth).length,
    };
}
