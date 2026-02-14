export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  image?: string;
}

export interface PriceReport {
  id: string;
  itemId: string;
  itemName: string;
  price: number;
  location: string;
  storeName: string;
  reportedBy: string;
  reportedAt: string;
  verified: boolean;
}

export interface MenuRahmahStall {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  menuItems: string[];
  openingHours: string;
  rating: number;
}

export interface SavingItem {
  itemName: string;
  normalPrice: number;
  lowestPrice: number;
  savings: number;
  percentage: number;
  location: string;
}

export type NavItem = 'home' | 'map' | 'report' | 'account';
