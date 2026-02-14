import { GroceryItem, PriceReport, SavingItem } from '../types';

export const groceryItems: GroceryItem[] = [
  {
    id: '1',
    name: 'Grade A Eggs',
    category: 'Dairy & Eggs',
    unit: '10 pieces',
  },
  {
    id: '2',
    name: '5kg Cooking Oil',
    category: 'Cooking Essentials',
    unit: '5kg',
  },
  {
    id: '3',
    name: 'Local Chicken',
    category: 'Meat & Poultry',
    unit: 'per kg',
  },
  {
    id: '4',
    name: 'White Rice',
    category: 'Grains',
    unit: '10kg',
  },
  {
    id: '5',
    name: 'Fresh Milk',
    category: 'Dairy & Eggs',
    unit: '1 liter',
  },
  {
    id: '6',
    name: 'Onions',
    category: 'Vegetables',
    unit: 'per kg',
  },
];

export const priceReports: PriceReport[] = [
  {
    id: '1',
    itemId: '1',
    itemName: 'Grade A Eggs',
    price: 12.50,
    location: 'Petaling Jaya',
    storeName: 'Mydin PJ',
    reportedBy: 'Ahmad',
    reportedAt: new Date('2026-02-10').toISOString(),
    verified: true,
  },
  {
    id: '2',
    itemId: '1',
    itemName: 'Grade A Eggs',
    price: 14.90,
    location: 'Kuala Lumpur',
    storeName: 'Aeon AU2',
    reportedBy: 'Siti',
    reportedAt: new Date('2026-02-12').toISOString(),
    verified: true,
  },
  {
    id: '3',
    itemId: '2',
    itemName: '5kg Cooking Oil',
    price: 28.50,
    location: 'Shah Alam',
    storeName: 'Giant Shah Alam',
    reportedBy: 'Kumar',
    reportedAt: new Date('2026-02-11').toISOString(),
    verified: true,
  },
  {
    id: '4',
    itemId: '2',
    itemName: '5kg Cooking Oil',
    price: 32.90,
    location: 'Subang Jaya',
    storeName: 'Tesco Subang',
    reportedBy: 'Lily',
    reportedAt: new Date('2026-02-13').toISOString(),
    verified: true,
  },
  {
    id: '5',
    itemId: '3',
    itemName: 'Local Chicken',
    price: 9.80,
    location: 'Cheras',
    storeName: 'Pasar Cheras',
    reportedBy: 'Raj',
    reportedAt: new Date('2026-02-14').toISOString(),
    verified: true,
  },
  {
    id: '6',
    itemId: '3',
    itemName: 'Local Chicken',
    price: 11.50,
    location: 'KLCC',
    storeName: 'Mercato KLCC',
    reportedBy: 'Mei Ling',
    reportedAt: new Date('2026-02-13').toISOString(),
    verified: true,
  },
];

export const topSavings: SavingItem[] = [
  {
    itemName: '5kg Cooking Oil',
    normalPrice: 32.90,
    lowestPrice: 28.50,
    savings: 4.40,
    percentage: 13.4,
    location: 'Giant Shah Alam',
  },
  {
    itemName: 'Grade A Eggs',
    normalPrice: 14.90,
    lowestPrice: 12.50,
    savings: 2.40,
    percentage: 16.1,
    location: 'Mydin PJ',
  },
  {
    itemName: 'Local Chicken',
    normalPrice: 11.50,
    lowestPrice: 9.80,
    savings: 1.70,
    percentage: 14.8,
    location: 'Pasar Cheras',
  },
];

export const getItemPriceRange = (itemId: string) => {
  const itemPrices = priceReports.filter((report) => report.itemId === itemId);
  if (itemPrices.length === 0) return null;

  const prices = itemPrices.map((report) => report.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    average: prices.reduce((a, b) => a + b, 0) / prices.length,
  };
};
