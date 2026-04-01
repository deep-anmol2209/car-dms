import { createClient } from "@supabase/supabase-js"



const supabase = createClient(
  "https://vsuwabzpkullmdzfsxec.supabase.co",
  "sb_publishable_T_LSV02lXAp-QRW_4ZM56w_rOEExd7V"
);

const myData = [
  {      
    vin: "HYUCRTA202300001",
    stock_number: "HY001",
    year: 2023,
    make: "Hyundai",
    model: "Creta",
    trim: "SX",
    odometer: 12000,
    condition: "Used",
    status: "Active",
    purchase_price: 14000,
    retail_price: 16500,
    extra_costs: 500,
    taxes: 1200
  },
  {     
    vin: "HYUCRTA202200002",
    stock_number: "HY002",
    year: 2022,
    make: "Hyundai",
    model: "Creta",
    trim: "SX(O)",
    odometer: 18000,
    condition: "Used",
    status: "Sold",
    purchase_price: 13500,
    retail_price: 15800,
    extra_costs: 600,
    taxes: 1100
  },
  {     
    vin: "TOYFRTR202100003",
    stock_number: "TY001",
    year: 2021,
    make: "Toyota",
    model: "Fortuner",
    trim: "Legender",
    odometer: 25000,
    condition: "Used",
    status: "Active",
    purchase_price: 32000,
    retail_price: 36500,
    extra_costs: 1200,
    taxes: 2500
  },
  {     
    vin: "TOYINNO202000004",
    stock_number: "TY002",
    year: 2020,
    make: "Toyota",
    model: "Innova",
    trim: "Crysta",
    odometer: 40000,
    condition: "Used",
    status: "Active",
    purchase_price: 22000,
    retail_price: 25500,
    extra_costs: 900,
    taxes: 1800
  },
  {     
    vin: "MAHXUV7202300005",
    stock_number: "MH001",
    year: 2023,
    make: "Mahindra",
    model: "XUV700",
    trim: "AX7",
    odometer: 10000,
    condition: "Used",
    status: "Active",
    purchase_price: 26000,
    retail_price: 29500,
    extra_costs: 1000,
    taxes: 2000
  },
  {      
    vin: "MAHSCOR202100006",
    stock_number: "MH002",
    year: 2021,
    make: "Mahindra",
    model: "Scorpio",
    trim: "S11",
    odometer: 35000,
    condition: "Used",
    status: "Sold",
    purchase_price: 18000,
    retail_price: 21000,
    extra_costs: 700,
    taxes: 1500
  },
  {      
    vin: "HYUI020202200007",
    stock_number: "HY003",
    year: 2022,
    make: "Hyundai",
    model: "i20",
    trim: "Asta",
    odometer: 15000,
    condition: "Used",
    status: "Active",
    purchase_price: 9000,
    retail_price: 11500,
    extra_costs: 400,
    taxes: 800
  },
  {
    vin: "HYUVEN202100008",
    stock_number: "HY004",
    year: 2021,
    make: "Hyundai",
    model: "Verna",
    trim: "SX",
    odometer: 22000,
    condition: "Used",
    status: "Active",
    purchase_price: 11000,
    retail_price: 13500,
    extra_costs: 500,
    taxes: 900
  },
  {
    vin: "TOYCAR202200009",
    stock_number: "TY003",
    year: 2022,
    make: "Toyota",
    model: "Camry",
    trim: "Hybrid",
    odometer: 12000,
    condition: "Used",
    status: "Active",
    purchase_price: 28000,
    retail_price: 32000,
    extra_costs: 1200,
    taxes: 2300
  },
  {
    vin: "TOYCORO22000010",
    stock_number: "TY004",
    year: 2020,
    make: "Toyota",
    model: "Corolla",
    trim: "LE",
    odometer: 35000,
    condition: "Used",
    status: "Active",
    purchase_price: 15000,
    retail_price: 18000,
    extra_costs: 600,
    taxes: 1300
  },

  {
    vin: "HONDCRV02100011",
    stock_number: "HD001",
    year: 2021,
    make: "Honda",
    model: "CR-V",
    trim: "EX",
    odometer: 28000,
    condition: "Used",
    status: "Active",
    purchase_price: 24000,
    retail_price: 27500,
    extra_costs: 900,
    taxes: 2000
  },
  {
    vin: "HONDRV202200012",
    stock_number: "HD002",
    year: 2022,
    make: "Honda",
    model: "CR-V",
    trim: "Touring",
    odometer: 15000,
    condition: "Used",
    status: "Sold",
    purchase_price: 27000,
    retail_price: 31000,
    extra_costs: 1100,
    taxes: 2300
  },
  {      
    vin: "HONDITY202000013",
    stock_number: "HD003",
    year: 2020,
    make: "Honda",
    model: "City",
    trim: "VX",
    odometer: 40000,
    condition: "Used",
    status: "Active",
    purchase_price: 10000,
    retail_price: 12500,
    extra_costs: 500,
    taxes: 900
  },
  {    
    vin: "HONDCIC202100014",
    stock_number: "HD004",
    year: 2021,
    make: "Honda",
    model: "Civic",
    trim: "Sport",
    odometer: 25000,
    condition: "Used",
    status: "Active",
    purchase_price: 20000,
    retail_price: 23500,
    extra_costs: 800,
    taxes: 1700
  },
  {   
    vin: "HONDIVC202200015",
    stock_number: "HD005",
    year: 2022,
    make: "Honda",
    model: "Civic",
    trim: "Touring",
    odometer: 12000,
    condition: "Used",
    status: "Active",
    purchase_price: 23000,
    retail_price: 27000,
    extra_costs: 900,
    taxes: 1900
  },

  {     
    vin: "MAHHZAR202300016",
    stock_number: "MH003",
    year: 2023,
    make: "Mahindra",
    model: "Thar",
    trim: "LX",
    odometer: 8000,
    condition: "Used",
    status: "Active",
    purchase_price: 22000,
    retail_price: 25500,
    extra_costs: 700,
    taxes: 1800
  },
  {      
    vin: "MAHU300202200017",
    stock_number: "MH004",
    year: 2022,
    make: "Mahindra",
    model: "XUV300",
    trim: "W8",
    odometer: 14000,
    condition: "Used",
    status: "Active",
    purchase_price: 14000,
    retail_price: 17000,
    extra_costs: 500,
    taxes: 1200
  },
  {      
    vin: "HYUAWCA202100018",
    stock_number: "HY005",
    year: 2021,
    make: "Hyundai",
    model: "Alcazar",
    trim: "Platinum",
    odometer: 22000,
    condition: "Used",
    status: "Active",
    purchase_price: 21000,
    retail_price: 24500,
    extra_costs: 800,
    taxes: 1700
  },
  {      
    vin: "TOYSHIL202000019",
    stock_number: "TY005",
    year: 2020,
    make: "Toyota",
    model: "Hilux",
    trim: "Standard",
    odometer: 45000,
    condition: "Used",
    status: "Sold",
    purchase_price: 26000,
    retail_price: 30000,
    extra_costs: 900,
    taxes: 2100
  },
  {    
    vin: "HONAMAZ202100020",
    stock_number: "HD006",
    year: 2021,
    make: "Honda",
    model: "Amaze",
    trim: "VX",
    odometer: 30000,
    condition: "Used",
    status: "Active",
    purchase_price: 8000,
    retail_price: 10500,
    extra_costs: 400,
    taxes: 700
  }
]

  async function run() {
    const { data, error } = await supabase
      .from("vehicles")
      .insert(myData)
      .select();
  
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Inserted:", data.length);
    }
  }
  
  run();