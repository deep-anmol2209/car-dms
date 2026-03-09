// Demo Data Generator for Adaptus DMS
// Generates realistic demo data for all entities

import { VEHICLE_DATABASE } from './vehicle-database';

// Helper to get random item from array
function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to get random number in range
function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to get random date in past N days
function randomDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - randomNumber(0, daysAgo));
    return date.toISOString();
}

// Generate VIN
function generateVIN(): string {
    const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
    let vin = '';
    for (let i = 0; i < 17; i++) {
        vin += chars[Math.floor(Math.random() * chars.length)];
    }
    return vin;
}

// Generate stock number
function generateStockNumber(index: number): string {
    return `STK${String(index).padStart(4, '0')}`;
}

// Customer names
const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'James', 'Jennifer', 'Robert', 'Linda', 'William', 'Mary', 'Richard', 'Patricia', 'Thomas', 'Barbara', 'Christopher', 'Elizabeth', 'Daniel', 'Susan'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

// Generate phone number
function generatePhone(): string {
    return `(${randomNumber(200, 999)}) ${randomNumber(200, 999)}-${randomNumber(1000, 9999)}`;
}

// Generate email
function generateEmail(firstName: string, lastName: string): string {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomItem(domains)}`;
}

// Generate Vehicles
export function generateDemoVehicles(count: number = 50) {
    const vehicles = [];
    const statuses = ['Active', 'Sold', 'Inactive', 'Coming Soon'];
    const conditions = ['New', 'Used', 'Certified Pre-Owned'];
    const colors = ['Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Beige'];

    for (let i = 0; i < count; i++) {
        const make = randomItem(VEHICLE_DATABASE);
        const model = randomItem(make.models);
        const year = randomNumber(2018, 2024);
        const condition = year >= 2023 ? 'New' : randomItem(conditions);
        const basePurchasePrice = randomNumber(15000, 60000);
        const markup = randomNumber(3000, 12000);

        vehicles.push({
            id: `vehicle-${i + 1}`,
            vin: generateVIN(),
            stockNumber: generateStockNumber(i + 1),
            year,
            make: make.name,
            model: model.name,
            trim: randomItem(['Base', 'LX', 'EX', 'Sport', 'Limited', 'Premium', 'Touring']),
            condition,
            status: randomItem(statuses),
            mileage: condition === 'New' ? randomNumber(5, 50) : randomNumber(10000, 120000),
            exteriorColor: randomItem(colors),
            interiorColor: randomItem(colors),
            purchasePrice: basePurchasePrice,
            retailPrice: basePurchasePrice + markup,
            extraCosts: randomNumber(200, 1500),
            taxes: Math.round((basePurchasePrice + markup) * 0.13),
            description: `${year} ${make.name} ${model.name} in excellent condition`,
            features: ['Bluetooth', 'Backup Camera', 'Cruise Control', 'Power Windows'],
            created_at: randomDate(180),
            updated_at: randomDate(30),
        });
    }

    return vehicles;
}

// Generate Customers
export function generateDemoCustomers(count: number = 100) {
    const customers = [];

    for (let i = 0; i < count; i++) {
        const firstName = randomItem(firstNames);
        const lastName = randomItem(lastNames);

        customers.push({
            id: `customer-${i + 1}`,
            name: `${firstName} ${lastName}`,
            email: generateEmail(firstName, lastName),
            phone: generatePhone(),
            address: `${randomNumber(100, 9999)} ${randomItem(['Main', 'Oak', 'Maple', 'Cedar', 'Pine'])} St`,
            city: randomItem(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia']),
            state: randomItem(['NY', 'CA', 'IL', 'TX', 'AZ', 'PA']),
            zipCode: String(randomNumber(10000, 99999)),
            created_at: randomDate(365),
        });
    }

    return customers;
}

// Generate Leads
export function generateDemoLeads(count: number = 75, customers: any[], vehicles: any[]) {
    const leads = [];
    const sources = ['Walk-in', 'Phone Call', 'Website', 'Referral', 'Social Media', 'Email'];
    const statuses = ['Not Started', 'In Progress', 'Qualified', 'Won', 'Lost'];

    for (let i = 0; i < count; i++) {
        const customer = randomItem(customers);
        const vehicle = Math.random() > 0.3 ? randomItem(vehicles) : null;

        leads.push({
            id: `lead-${i + 1}`,
            customer_id: customer.id,
            vehicle_interest_id: vehicle?.id || null,
            source: randomItem(sources),
            status: randomItem(statuses),
            notes: `Interested in ${vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'various models'}`,
            created_at: randomDate(90),
            updated_at: randomDate(30),
        });
    }

    return leads;
}

// Generate Test Drives
export function generateDemoTestDrives(count: number = 40, customers: any[], vehicles: any[]) {
    const testDrives = [];
    const statuses = ['Scheduled', 'Completed', 'Cancelled', 'No Show'];

    for (let i = 0; i < count; i++) {
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + randomNumber(-30, 30));

        testDrives.push({
            id: `testdrive-${i + 1}`,
            customer_id: randomItem(customers).id,
            vehicle_id: randomItem(vehicles).id,
            scheduled_date: scheduledDate.toISOString(),
            status: randomItem(statuses),
            notes: randomItem(['Great experience', 'Customer loved it', 'Needs to think about it', 'Comparing with other models']),
            created_at: randomDate(60),
        });
    }

    return testDrives;
}

// Generate Invoices
export function generateDemoInvoices(count: number = 60, customers: any[], vehicles: any[]) {
    const invoices = [];
    const statuses = ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'];
    const paymentMethods = ['Cash', 'Check', 'Credit Card', 'Financing', 'Wire Transfer'];

    for (let i = 0; i < count; i++) {
        const vehicle = randomItem(vehicles);
        const subtotal = vehicle.retailPrice;
        const taxRate = 0.13;
        const tax = Math.round(subtotal * taxRate);
        const total = subtotal + tax;

        invoices.push({
            id: `invoice-${i + 1}`,
            invoice_number: `INV-${String(i + 1).padStart(5, '0')}`,
            customer_id: randomItem(customers).id,
            vehicle_id: vehicle.id,
            invoice_date: randomDate(180),
            due_date: randomDate(150),
            subtotal,
            tax,
            total,
            status: randomItem(statuses),
            payment_method: randomItem(paymentMethods),
            notes: 'Standard vehicle sale',
            created_at: randomDate(180),
        });
    }

    return invoices;
}

// Generate Sales Deals
export function generateDemoSalesDeals(count: number = 50, customers: any[], vehicles: any[]) {
    const deals = [];
    const statuses = ['Pending', 'Approved', 'Completed', 'Cancelled'];

    for (let i = 0; i < count; i++) {
        const vehicle = randomItem(vehicles);

        deals.push({
            id: `deal-${i + 1}`,
            customer_id: randomItem(customers).id,
            vehicle_id: vehicle.id,
            amount: vehicle.retailPrice,
            status: randomItem(statuses),
            sale_date: randomDate(120),
            created_at: randomDate(120),
        });
    }

    return deals;
}

// Generate Users
export function generateDemoUsers(count: number = 12) {
    const users = [];
    const roles = ['Admin', 'Manager', 'Staff'];

    for (let i = 0; i < count; i++) {
        const firstName = randomItem(firstNames);
        const lastName = randomItem(lastNames);

        users.push({
            id: `user-${i + 1}`,
            full_name: `${firstName} ${lastName}`,
            email: generateEmail(firstName, lastName),
            role: i < 2 ? 'Admin' : i < 5 ? 'Manager' : 'Staff',
            phone: generatePhone(),
            created_at: randomDate(365),
        });
    }

    return users;
}

// Generate all demo data
export function generateAllDemoData() {
    const vehicles = generateDemoVehicles(50);
    const customers = generateDemoCustomers(100);
    const leads = generateDemoLeads(75, customers, vehicles);
    const testDrives = generateDemoTestDrives(40, customers, vehicles);
    const invoices = generateDemoInvoices(60, customers, vehicles);
    const salesDeals = generateDemoSalesDeals(50, customers, vehicles);
    const users = generateDemoUsers(12);

    return {
        vehicles,
        customers,
        leads,
        testDrives,
        invoices,
        salesDeals,
        users,
        stats: {
            totalVehicles: vehicles.length,
            totalCustomers: customers.length,
            totalLeads: leads.length,
            totalTestDrives: testDrives.length,
            totalInvoices: invoices.length,
            totalSalesDeals: salesDeals.length,
            totalUsers: users.length,
        }
    };
}

// Export singleton instance
export const DEMO_DATA = generateAllDemoData();
