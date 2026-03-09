// Comprehensive Vehicle Makes and Models Database
// Covers all major manufacturers worldwide

export interface VehicleModel {
    name: string;
    years?: string; // Production years
    type?: string; // Sedan, SUV, Truck, etc.
}

export interface VehicleMake {
    name: string;
    country: string;
    models: VehicleModel[];
}

export const VEHICLE_DATABASE: VehicleMake[] = [
    // American Brands
    {
        name: "Ford",
        country: "USA",
        models: [
            { name: "F-150", type: "Truck" },
            { name: "F-250", type: "Truck" },
            { name: "F-350", type: "Truck" },
            { name: "Ranger", type: "Truck" },
            { name: "Maverick", type: "Truck" },
            { name: "Mustang", type: "Sports Car" },
            { name: "Mustang Mach-E", type: "SUV" },
            { name: "Explorer", type: "SUV" },
            { name: "Expedition", type: "SUV" },
            { name: "Bronco", type: "SUV" },
            { name: "Bronco Sport", type: "SUV" },
            { name: "Edge", type: "SUV" },
            { name: "Escape", type: "SUV" },
            { name: "EcoSport", type: "SUV" },
            { name: "Fusion", type: "Sedan" },
            { name: "Taurus", type: "Sedan" },
            { name: "Focus", type: "Sedan" },
            { name: "Fiesta", type: "Sedan" },
            { name: "Transit", type: "Van" },
            { name: "Transit Connect", type: "Van" },
            { name: "E-Series", type: "Van" },
        ]
    },
    {
        name: "Chevrolet",
        country: "USA",
        models: [
            { name: "Silverado 1500", type: "Truck" },
            { name: "Silverado 2500HD", type: "Truck" },
            { name: "Silverado 3500HD", type: "Truck" },
            { name: "Colorado", type: "Truck" },
            { name: "Tahoe", type: "SUV" },
            { name: "Suburban", type: "SUV" },
            { name: "Traverse", type: "SUV" },
            { name: "Equinox", type: "SUV" },
            { name: "Blazer", type: "SUV" },
            { name: "Trailblazer", type: "SUV" },
            { name: "Trax", type: "SUV" },
            { name: "Corvette", type: "Sports Car" },
            { name: "Camaro", type: "Sports Car" },
            { name: "Malibu", type: "Sedan" },
            { name: "Impala", type: "Sedan" },
            { name: "Cruze", type: "Sedan" },
            { name: "Spark", type: "Sedan" },
            { name: "Bolt EV", type: "Electric" },
            { name: "Bolt EUV", type: "Electric" },
            { name: "Express", type: "Van" },
        ]
    },
    {
        name: "GMC",
        country: "USA",
        models: [
            { name: "Sierra 1500", type: "Truck" },
            { name: "Sierra 2500HD", type: "Truck" },
            { name: "Sierra 3500HD", type: "Truck" },
            { name: "Canyon", type: "Truck" },
            { name: "Yukon", type: "SUV" },
            { name: "Yukon XL", type: "SUV" },
            { name: "Acadia", type: "SUV" },
            { name: "Terrain", type: "SUV" },
            { name: "Envoy", type: "SUV" },
            { name: "Savana", type: "Van" },
            { name: "Hummer EV", type: "Electric" },
        ]
    },
    {
        name: "Ram",
        country: "USA",
        models: [
            { name: "1500", type: "Truck" },
            { name: "2500", type: "Truck" },
            { name: "3500", type: "Truck" },
            { name: "ProMaster", type: "Van" },
            { name: "ProMaster City", type: "Van" },
        ]
    },
    {
        name: "Dodge",
        country: "USA",
        models: [
            { name: "Charger", type: "Sedan" },
            { name: "Challenger", type: "Sports Car" },
            { name: "Durango", type: "SUV" },
            { name: "Journey", type: "SUV" },
            { name: "Grand Caravan", type: "Van" },
        ]
    },
    {
        name: "Jeep",
        country: "USA",
        models: [
            { name: "Wrangler", type: "SUV" },
            { name: "Gladiator", type: "Truck" },
            { name: "Grand Cherokee", type: "SUV" },
            { name: "Cherokee", type: "SUV" },
            { name: "Compass", type: "SUV" },
            { name: "Renegade", type: "SUV" },
            { name: "Wagoneer", type: "SUV" },
            { name: "Grand Wagoneer", type: "SUV" },
        ]
    },
    {
        name: "Cadillac",
        country: "USA",
        models: [
            { name: "Escalade", type: "SUV" },
            { name: "XT4", type: "SUV" },
            { name: "XT5", type: "SUV" },
            { name: "XT6", type: "SUV" },
            { name: "CT4", type: "Sedan" },
            { name: "CT5", type: "Sedan" },
            { name: "CT6", type: "Sedan" },
            { name: "Lyriq", type: "Electric" },
        ]
    },
    {
        name: "Tesla",
        country: "USA",
        models: [
            { name: "Model S", type: "Electric" },
            { name: "Model 3", type: "Electric" },
            { name: "Model X", type: "Electric" },
            { name: "Model Y", type: "Electric" },
            { name: "Cybertruck", type: "Electric" },
        ]
    },
    {
        name: "Lincoln",
        country: "USA",
        models: [
            { name: "Navigator", type: "SUV" },
            { name: "Aviator", type: "SUV" },
            { name: "Nautilus", type: "SUV" },
            { name: "Corsair", type: "SUV" },
        ]
    },
    {
        name: "Buick",
        country: "USA",
        models: [
            { name: "Enclave", type: "SUV" },
            { name: "Encore", type: "SUV" },
            { name: "Encore GX", type: "SUV" },
            { name: "Envision", type: "SUV" },
        ]
    },

    // Japanese Brands
    {
        name: "Toyota",
        country: "Japan",
        models: [
            { name: "Camry", type: "Sedan" },
            { name: "Corolla", type: "Sedan" },
            { name: "Avalon", type: "Sedan" },
            { name: "Prius", type: "Hybrid" },
            { name: "RAV4", type: "SUV" },
            { name: "Highlander", type: "SUV" },
            { name: "4Runner", type: "SUV" },
            { name: "Sequoia", type: "SUV" },
            { name: "Land Cruiser", type: "SUV" },
            { name: "Tacoma", type: "Truck" },
            { name: "Tundra", type: "Truck" },
            { name: "Sienna", type: "Van" },
            { name: "GR86", type: "Sports Car" },
            { name: "Supra", type: "Sports Car" },
            { name: "bZ4X", type: "Electric" },
            { name: "C-HR", type: "SUV" },
            { name: "Venza", type: "SUV" },
        ]
    },
    {
        name: "Honda",
        country: "Japan",
        models: [
            { name: "Civic", type: "Sedan" },
            { name: "Accord", type: "Sedan" },
            { name: "Insight", type: "Hybrid" },
            { name: "CR-V", type: "SUV" },
            { name: "HR-V", type: "SUV" },
            { name: "Pilot", type: "SUV" },
            { name: "Passport", type: "SUV" },
            { name: "Ridgeline", type: "Truck" },
            { name: "Odyssey", type: "Van" },
        ]
    },
    {
        name: "Nissan",
        country: "Japan",
        models: [
            { name: "Altima", type: "Sedan" },
            { name: "Maxima", type: "Sedan" },
            { name: "Sentra", type: "Sedan" },
            { name: "Versa", type: "Sedan" },
            { name: "Rogue", type: "SUV" },
            { name: "Murano", type: "SUV" },
            { name: "Pathfinder", type: "SUV" },
            { name: "Armada", type: "SUV" },
            { name: "Kicks", type: "SUV" },
            { name: "Frontier", type: "Truck" },
            { name: "Titan", type: "Truck" },
            { name: "370Z", type: "Sports Car" },
            { name: "GT-R", type: "Sports Car" },
            { name: "Leaf", type: "Electric" },
            { name: "Ariya", type: "Electric" },
        ]
    },
    {
        name: "Mazda",
        country: "Japan",
        models: [
            { name: "Mazda3", type: "Sedan" },
            { name: "Mazda6", type: "Sedan" },
            { name: "CX-3", type: "SUV" },
            { name: "CX-30", type: "SUV" },
            { name: "CX-5", type: "SUV" },
            { name: "CX-50", type: "SUV" },
            { name: "CX-9", type: "SUV" },
            { name: "CX-90", type: "SUV" },
            { name: "MX-5 Miata", type: "Sports Car" },
        ]
    },
    {
        name: "Subaru",
        country: "Japan",
        models: [
            { name: "Impreza", type: "Sedan" },
            { name: "Legacy", type: "Sedan" },
            { name: "WRX", type: "Sports Car" },
            { name: "BRZ", type: "Sports Car" },
            { name: "Crosstrek", type: "SUV" },
            { name: "Forester", type: "SUV" },
            { name: "Outback", type: "SUV" },
            { name: "Ascent", type: "SUV" },
            { name: "Solterra", type: "Electric" },
        ]
    },
    {
        name: "Mitsubishi",
        country: "Japan",
        models: [
            { name: "Mirage", type: "Sedan" },
            { name: "Outlander", type: "SUV" },
            { name: "Outlander Sport", type: "SUV" },
            { name: "Eclipse Cross", type: "SUV" },
        ]
    },
    {
        name: "Acura",
        country: "Japan",
        models: [
            { name: "ILX", type: "Sedan" },
            { name: "TLX", type: "Sedan" },
            { name: "Integra", type: "Sedan" },
            { name: "RDX", type: "SUV" },
            { name: "MDX", type: "SUV" },
            { name: "NSX", type: "Sports Car" },
        ]
    },
    {
        name: "Lexus",
        country: "Japan",
        models: [
            { name: "IS", type: "Sedan" },
            { name: "ES", type: "Sedan" },
            { name: "LS", type: "Sedan" },
            { name: "UX", type: "SUV" },
            { name: "NX", type: "SUV" },
            { name: "RX", type: "SUV" },
            { name: "GX", type: "SUV" },
            { name: "LX", type: "SUV" },
            { name: "LC", type: "Sports Car" },
            { name: "RC", type: "Sports Car" },
        ]
    },
    {
        name: "Infiniti",
        country: "Japan",
        models: [
            { name: "Q50", type: "Sedan" },
            { name: "Q60", type: "Sports Car" },
            { name: "QX50", type: "SUV" },
            { name: "QX55", type: "SUV" },
            { name: "QX60", type: "SUV" },
            { name: "QX80", type: "SUV" },
        ]
    },

    // German Brands
    {
        name: "BMW",
        country: "Germany",
        models: [
            { name: "2 Series", type: "Sedan" },
            { name: "3 Series", type: "Sedan" },
            { name: "4 Series", type: "Sedan" },
            { name: "5 Series", type: "Sedan" },
            { name: "7 Series", type: "Sedan" },
            { name: "8 Series", type: "Sports Car" },
            { name: "X1", type: "SUV" },
            { name: "X2", type: "SUV" },
            { name: "X3", type: "SUV" },
            { name: "X4", type: "SUV" },
            { name: "X5", type: "SUV" },
            { name: "X6", type: "SUV" },
            { name: "X7", type: "SUV" },
            { name: "Z4", type: "Sports Car" },
            { name: "i4", type: "Electric" },
            { name: "iX", type: "Electric" },
            { name: "i7", type: "Electric" },
        ]
    },
    {
        name: "Mercedes-Benz",
        country: "Germany",
        models: [
            { name: "A-Class", type: "Sedan" },
            { name: "C-Class", type: "Sedan" },
            { name: "E-Class", type: "Sedan" },
            { name: "S-Class", type: "Sedan" },
            { name: "CLA", type: "Sedan" },
            { name: "CLS", type: "Sedan" },
            { name: "GLA", type: "SUV" },
            { name: "GLB", type: "SUV" },
            { name: "GLC", type: "SUV" },
            { name: "GLE", type: "SUV" },
            { name: "GLS", type: "SUV" },
            { name: "G-Class", type: "SUV" },
            { name: "EQS", type: "Electric" },
            { name: "EQE", type: "Electric" },
            { name: "EQB", type: "Electric" },
            { name: "AMG GT", type: "Sports Car" },
        ]
    },
    {
        name: "Audi",
        country: "Germany",
        models: [
            { name: "A3", type: "Sedan" },
            { name: "A4", type: "Sedan" },
            { name: "A5", type: "Sedan" },
            { name: "A6", type: "Sedan" },
            { name: "A7", type: "Sedan" },
            { name: "A8", type: "Sedan" },
            { name: "Q3", type: "SUV" },
            { name: "Q4 e-tron", type: "Electric" },
            { name: "Q5", type: "SUV" },
            { name: "Q7", type: "SUV" },
            { name: "Q8", type: "SUV" },
            { name: "e-tron", type: "Electric" },
            { name: "e-tron GT", type: "Electric" },
            { name: "R8", type: "Sports Car" },
            { name: "TT", type: "Sports Car" },
        ]
    },
    {
        name: "Volkswagen",
        country: "Germany",
        models: [
            { name: "Jetta", type: "Sedan" },
            { name: "Passat", type: "Sedan" },
            { name: "Arteon", type: "Sedan" },
            { name: "Golf", type: "Hatchback" },
            { name: "GTI", type: "Hatchback" },
            { name: "Tiguan", type: "SUV" },
            { name: "Atlas", type: "SUV" },
            { name: "Atlas Cross Sport", type: "SUV" },
            { name: "Taos", type: "SUV" },
            { name: "ID.4", type: "Electric" },
        ]
    },
    {
        name: "Porsche",
        country: "Germany",
        models: [
            { name: "911", type: "Sports Car" },
            { name: "718 Boxster", type: "Sports Car" },
            { name: "718 Cayman", type: "Sports Car" },
            { name: "Panamera", type: "Sedan" },
            { name: "Macan", type: "SUV" },
            { name: "Cayenne", type: "SUV" },
            { name: "Taycan", type: "Electric" },
        ]
    },

    // Korean Brands
    {
        name: "Hyundai",
        country: "South Korea",
        models: [
            { name: "Elantra", type: "Sedan" },
            { name: "Sonata", type: "Sedan" },
            { name: "Accent", type: "Sedan" },
            { name: "Venue", type: "SUV" },
            { name: "Kona", type: "SUV" },
            { name: "Tucson", type: "SUV" },
            { name: "Santa Fe", type: "SUV" },
            { name: "Palisade", type: "SUV" },
            { name: "Santa Cruz", type: "Truck" },
            { name: "Ioniq 5", type: "Electric" },
            { name: "Ioniq 6", type: "Electric" },
            { name: "Veloster", type: "Sports Car" },
        ]
    },
    {
        name: "Kia",
        country: "South Korea",
        models: [
            { name: "Forte", type: "Sedan" },
            { name: "K5", type: "Sedan" },
            { name: "Stinger", type: "Sedan" },
            { name: "Soul", type: "SUV" },
            { name: "Seltos", type: "SUV" },
            { name: "Sportage", type: "SUV" },
            { name: "Sorento", type: "SUV" },
            { name: "Telluride", type: "SUV" },
            { name: "Carnival", type: "Van" },
            { name: "EV6", type: "Electric" },
            { name: "Niro", type: "Hybrid" },
        ]
    },
    {
        name: "Genesis",
        country: "South Korea",
        models: [
            { name: "G70", type: "Sedan" },
            { name: "G80", type: "Sedan" },
            { name: "G90", type: "Sedan" },
            { name: "GV60", type: "Electric" },
            { name: "GV70", type: "SUV" },
            { name: "GV80", type: "SUV" },
        ]
    },

    // British Brands
    {
        name: "Land Rover",
        country: "UK",
        models: [
            { name: "Defender", type: "SUV" },
            { name: "Discovery", type: "SUV" },
            { name: "Discovery Sport", type: "SUV" },
            { name: "Range Rover", type: "SUV" },
            { name: "Range Rover Sport", type: "SUV" },
            { name: "Range Rover Velar", type: "SUV" },
            { name: "Range Rover Evoque", type: "SUV" },
        ]
    },
    {
        name: "Jaguar",
        country: "UK",
        models: [
            { name: "XE", type: "Sedan" },
            { name: "XF", type: "Sedan" },
            { name: "XJ", type: "Sedan" },
            { name: "F-Type", type: "Sports Car" },
            { name: "E-Pace", type: "SUV" },
            { name: "F-Pace", type: "SUV" },
            { name: "I-Pace", type: "Electric" },
        ]
    },
    {
        name: "Mini",
        country: "UK",
        models: [
            { name: "Cooper", type: "Hatchback" },
            { name: "Cooper S", type: "Hatchback" },
            { name: "Countryman", type: "SUV" },
            { name: "Clubman", type: "Hatchback" },
        ]
    },

    // Italian Brands
    {
        name: "Ferrari",
        country: "Italy",
        models: [
            { name: "Roma", type: "Sports Car" },
            { name: "Portofino", type: "Sports Car" },
            { name: "F8 Tributo", type: "Sports Car" },
            { name: "SF90 Stradale", type: "Sports Car" },
            { name: "812 Superfast", type: "Sports Car" },
            { name: "Purosangue", type: "SUV" },
        ]
    },
    {
        name: "Lamborghini",
        country: "Italy",
        models: [
            { name: "Huracán", type: "Sports Car" },
            { name: "Aventador", type: "Sports Car" },
            { name: "Urus", type: "SUV" },
        ]
    },
    {
        name: "Maserati",
        country: "Italy",
        models: [
            { name: "Ghibli", type: "Sedan" },
            { name: "Quattroporte", type: "Sedan" },
            { name: "Levante", type: "SUV" },
            { name: "Grecale", type: "SUV" },
            { name: "MC20", type: "Sports Car" },
        ]
    },
    {
        name: "Alfa Romeo",
        country: "Italy",
        models: [
            { name: "Giulia", type: "Sedan" },
            { name: "Stelvio", type: "SUV" },
            { name: "Tonale", type: "SUV" },
        ]
    },
    {
        name: "Fiat",
        country: "Italy",
        models: [
            { name: "500", type: "Hatchback" },
            { name: "500X", type: "SUV" },
            { name: "500L", type: "Hatchback" },
        ]
    },

    // French Brands
    {
        name: "Peugeot",
        country: "France",
        models: [
            { name: "208", type: "Hatchback" },
            { name: "308", type: "Hatchback" },
            { name: "508", type: "Sedan" },
            { name: "2008", type: "SUV" },
            { name: "3008", type: "SUV" },
            { name: "5008", type: "SUV" },
        ]
    },
    {
        name: "Renault",
        country: "France",
        models: [
            { name: "Clio", type: "Hatchback" },
            { name: "Megane", type: "Hatchback" },
            { name: "Captur", type: "SUV" },
            { name: "Kadjar", type: "SUV" },
            { name: "Koleos", type: "SUV" },
        ]
    },
    {
        name: "Citroën",
        country: "France",
        models: [
            { name: "C3", type: "Hatchback" },
            { name: "C4", type: "Hatchback" },
            { name: "C5 Aircross", type: "SUV" },
        ]
    },

    // Swedish Brands
    {
        name: "Volvo",
        country: "Sweden",
        models: [
            { name: "S60", type: "Sedan" },
            { name: "S90", type: "Sedan" },
            { name: "V60", type: "Wagon" },
            { name: "V90", type: "Wagon" },
            { name: "XC40", type: "SUV" },
            { name: "XC60", type: "SUV" },
            { name: "XC90", type: "SUV" },
            { name: "C40 Recharge", type: "Electric" },
        ]
    },

    // Chinese Brands
    {
        name: "BYD",
        country: "China",
        models: [
            { name: "Atto 3", type: "Electric" },
            { name: "Seal", type: "Electric" },
            { name: "Han", type: "Electric" },
            { name: "Tang", type: "Electric" },
        ]
    },
    {
        name: "NIO",
        country: "China",
        models: [
            { name: "ET5", type: "Electric" },
            { name: "ET7", type: "Electric" },
            { name: "ES6", type: "Electric" },
            { name: "ES7", type: "Electric" },
            { name: "ES8", type: "Electric" },
        ]
    },
    {
        name: "Polestar",
        country: "China",
        models: [
            { name: "2", type: "Electric" },
            { name: "3", type: "Electric" },
        ]
    },

    // Other Brands
    {
        name: "Rivian",
        country: "USA",
        models: [
            { name: "R1T", type: "Electric Truck" },
            { name: "R1S", type: "Electric SUV" },
        ]
    },
    {
        name: "Lucid",
        country: "USA",
        models: [
            { name: "Air", type: "Electric" },
        ]
    },
];

// Helper functions
export function getAllMakes(): string[] {
    return VEHICLE_DATABASE.map(make => make.name).sort();
}

export function getModelsByMake(makeName: string): string[] {
    const make = VEHICLE_DATABASE.find(m => m.name.toLowerCase() === makeName.toLowerCase());
    return make ? make.models.map(model => model.name).sort() : [];
}

export function searchVehicles(query: string): Array<{ make: string; model: string; type?: string }> {
    const results: Array<{ make: string; model: string; type?: string }> = [];
    const lowerQuery = query.toLowerCase();

    VEHICLE_DATABASE.forEach(make => {
        make.models.forEach(model => {
            if (
                make.name.toLowerCase().includes(lowerQuery) ||
                model.name.toLowerCase().includes(lowerQuery) ||
                model.type?.toLowerCase().includes(lowerQuery)
            ) {
                results.push({
                    make: make.name,
                    model: model.name,
                    type: model.type
                });
            }
        });
    });

    return results;
}

export function getVehiclesByCountry(country: string): VehicleMake[] {
    return VEHICLE_DATABASE.filter(make =>
        make.country.toLowerCase() === country.toLowerCase()
    );
}

export function getTotalModelsCount(): number {
    return VEHICLE_DATABASE.reduce((total, make) => total + make.models.length, 0);
}
