import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  HAS_COMPLETED_ONBOARDING: "has_completed_onboarding",
  WEDDING_DETAILS: "wedding_details",
  BUDGET_DETAILS: "budget_details",
  TIMELINE_DETAILS: "timeline_details",
  GUEST_DETAILS: "guest_details",
  VENDOR_DETAILS: "vendor_details",
} as const;

export type VendorCategory = 
  | 'venue'
  | 'catering'
  | 'photography'
  | 'videography'
  | 'florist'
  | 'music'
  | 'cake'
  | 'decor'
  | 'attire'
  | 'beauty'
  | 'transportation'
  | 'other';

export type VendorStatus = 'researching' | 'contacted' | 'meeting_scheduled' | 'proposal_received' | 'hired' | 'declined';

export interface VendorContact {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

export interface VendorQuote {
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'accepted' | 'declined';
  notes?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  status: VendorStatus;
  contacts: VendorContact[];
  website?: string;
  instagram?: string;
  address?: string;
  description?: string;
  quotes: VendorQuote[];
  rating?: number;
  notes?: string;
  attachments?: string[];
}

export interface VendorDetails {
  vendors: Vendor[];
  categories: {
    [key in VendorCategory]: {
      isEnabled: boolean;
      order: number;
    };
  };
}

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';
export type TaskCategory = 
  | 'ceremony'
  | 'reception'
  | 'attire'
  | 'beauty'
  | 'flowers'
  | 'photography'
  | 'music'
  | 'transportation'
  | 'honeymoon'
  | 'legal'
  | 'other';

export type AgeRange = 'adult' | 'child' | 'infant';
export type GuestStatus = 'invited' | 'confirmed' | 'declined' | 'maybe';
export type DietaryRestriction = 'none' | 'vegetarian' | 'vegan' | 'gluten_free' | 'other';

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  ageRange: AgeRange;
  status: GuestStatus;
  email?: string;
  phone?: string;
  dietaryRestrictions?: DietaryRestriction[];
  additionalNotes?: string;
  tableId?: string;
  plusOne?: boolean;
  plusOneName?: string;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  location?: string;
  notes?: string;
}

export interface GuestDetails {
  guests: Guest[];
  tables: Table[];
}

export interface TimelineTask {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  completedDate?: string;
  dependsOn?: string[];
  notes?: string;
  assignedTo?: string[];
  attachments?: string[];
}

export interface TimelineDetails {
  tasks: TimelineTask[];
  categories: {
    [key in TaskCategory]: {
      isEnabled: boolean;
      order: number;
    };
  };
}

export interface BudgetItem {
  id: string;
  category: string;
  name: string;
  estimatedCost: number;
  actualCost?: number;
  paid?: number;
  notes?: string;
}

export interface BudgetDetails {
  totalBudget: number;
  items: BudgetItem[];
}


export const initializeVendors = async () => {
  try {
    const details = await getVendorDetails();
    if (!details) {
      const initialCategories: VendorDetails['categories'] = {
        venue: { isEnabled: true, order: 0 },
        catering: { isEnabled: true, order: 1 },
        photography: { isEnabled: true, order: 2 },
        videography: { isEnabled: true, order: 3 },
        florist: { isEnabled: true, order: 4 },
        music: { isEnabled: true, order: 5 },
        cake: { isEnabled: true, order: 6 },
        decor: { isEnabled: true, order: 7 },
        attire: { isEnabled: true, order: 8 },
        beauty: { isEnabled: true, order: 9 },
        transportation: { isEnabled: true, order: 10 },
        other: { isEnabled: true, order: 11 }
      };
      
      await setVendorDetails({
        vendors: [],
        categories: initialCategories
      });
    }
  } catch (error) {
    console.error("Error initializing vendors:", error);
    throw error;
  }
};

export const getVendorDetails = async (): Promise<VendorDetails | null> => {
  try {
    const details = await AsyncStorage.getItem(STORAGE_KEYS.VENDOR_DETAILS);
    return details ? JSON.parse(details) : null;
  } catch (error) {
    console.error("Error getting vendor details:", error);
    throw error;
  }
};

export const setVendorDetails = async (details: VendorDetails) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.VENDOR_DETAILS, JSON.stringify(details));
  } catch (error) {
    console.error("Error saving vendor details:", error);
    throw error;
  }
};

export const addVendor = async (vendor: Omit<Vendor, 'id'>) => {
  try {
    const details = await getVendorDetails();
    if (!details) await initializeVendors();
    
    const newVendor: Vendor = {
      ...vendor,
      id: Date.now().toString()
    };
    
    const updatedDetails = details ? {
      ...details,
      vendors: [...details.vendors, newVendor]
    } : {
      vendors: [newVendor],
      categories: {} as VendorDetails['categories']
    };
    
    await setVendorDetails(updatedDetails);
    return newVendor;
  } catch (error) {
    console.error("Error adding vendor:", error);
    throw error;
  }
};

export const updateVendor = async (vendorId: string, updates: Partial<Vendor>) => {
  try {
    const details = await getVendorDetails();
    if (!details) throw new Error("No vendor details found");
    
    const updatedVendors = details.vendors.map(vendor => 
      vendor.id === vendorId ? { ...vendor, ...updates } : vendor
    );
    
    await setVendorDetails({
      ...details,
      vendors: updatedVendors
    });
  } catch (error) {
    console.error("Error updating vendor:", error);
    throw error;
  }
};

export const deleteVendor = async (vendorId: string) => {
  try {
    const details = await getVendorDetails();
    if (!details) throw new Error("No vendor details found");
    
    const updatedVendors = details.vendors.filter(vendor => vendor.id !== vendorId);
    
    await setVendorDetails({
      ...details,
      vendors: updatedVendors
    });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    throw error;
  }
};

export const updateVendorCategoryOrder = async (categoryId: VendorCategory, newOrder: number) => {
  try {
    const details = await getVendorDetails();
    if (!details) throw new Error("No vendor details found");
    
    const updatedCategories = {
      ...details.categories,
      [categoryId]: {
        ...details.categories[categoryId],
        order: newOrder
      }
    };
    
    await setVendorDetails({
      ...details,
      categories: updatedCategories
    });
  } catch (error) {
    console.error("Error updating category order:", error);
    throw error;
  }
};

export const toggleVendorCategoryVisibility = async (categoryId: VendorCategory) => {
  try {
    const details = await getVendorDetails();
    if (!details) throw new Error("No vendor details found");
    
    const updatedCategories = {
      ...details.categories,
      [categoryId]: {
        ...details.categories[categoryId],
        isEnabled: !details.categories[categoryId].isEnabled
      }
    };
    
    await setVendorDetails({
      ...details,
      categories: updatedCategories
    });
  } catch (error) {
    console.error("Error toggling category visibility:", error);
    throw error;
  }
};

interface WeddingDetails {
  weddingDate: string;
}


export const initializeGuestList = async () => {
  try {
    const details = await getGuestDetails();
    if (!details) {
      await setGuestDetails({
        guests: [],
        tables: []
      });
    }
  } catch (error) {
    console.error("Error initializing guest list:", error);
    throw error;
  }
};

export const getGuestDetails = async (): Promise<GuestDetails | null> => {
  try {
    const details = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_DETAILS);
    return details ? JSON.parse(details) : null;
  } catch (error) {
    console.error("Error getting guest details:", error);
    throw error;
  }
};

export const setGuestDetails = async (details: GuestDetails) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GUEST_DETAILS, JSON.stringify(details));
  } catch (error) {
    console.error("Error saving guest details:", error);
    throw error;
  }
};

export const addGuest = async (guest: Omit<Guest, 'id'>) => {
  try {
    const details = await getGuestDetails();
    if (!details) await initializeGuestList();
    
    const newGuest: Guest = {
      ...guest,
      id: Date.now().toString()
    };
    
    const updatedDetails = details ? {
      ...details,
      guests: [...details.guests, newGuest]
    } : {
      guests: [newGuest],
      tables: []
    };
    
    await setGuestDetails(updatedDetails);
    return newGuest;
  } catch (error) {
    console.error("Error adding guest:", error);
    throw error;
  }
};

export const updateGuest = async (guestId: string, updates: Partial<Guest>) => {
  try {
    const details = await getGuestDetails();
    if (!details) throw new Error("No guest details found");
    
    const updatedGuests = details.guests.map(guest => 
      guest.id === guestId ? { ...guest, ...updates } : guest
    );
    
    await setGuestDetails({
      ...details,
      guests: updatedGuests
    });
  } catch (error) {
    console.error("Error updating guest:", error);
    throw error;
  }
};

export const deleteGuest = async (guestId: string) => {
  try {
    const details = await getGuestDetails();
    if (!details) throw new Error("No guest details found");
    
    const updatedGuests = details.guests.filter(guest => guest.id !== guestId);
    
    await setGuestDetails({
      ...details,
      guests: updatedGuests
    });
  } catch (error) {
    console.error("Error deleting guest:", error);
    throw error;
  }
};

export const addTable = async (table: Omit<Table, 'id'>) => {
  try {
    const details = await getGuestDetails();
    if (!details) await initializeGuestList();
    
    const newTable: Table = {
      ...table,
      id: Date.now().toString()
    };
    
    const updatedDetails = details ? {
      ...details,
      tables: [...details.tables, newTable]
    } : {
      guests: [],
      tables: [newTable]
    };
    
    await setGuestDetails(updatedDetails);
    return newTable;
  } catch (error) {
    console.error("Error adding table:", error);
    throw error;
  }
};

export const updateTable = async (tableId: string, updates: Partial<Table>) => {
  try {
    const details = await getGuestDetails();
    if (!details) throw new Error("No guest details found");
    
    const updatedTables = details.tables.map(table => 
      table.id === tableId ? { ...table, ...updates } : table
    );
    
    await setGuestDetails({
      ...details,
      tables: updatedTables
    });
  } catch (error) {
    console.error("Error updating table:", error);
    throw error;
  }
};

export const deleteTable = async (tableId: string) => {
  try {
    const details = await getGuestDetails();
    if (!details) throw new Error("No guest details found");
    
  
    const updatedGuests = details.guests.map(guest => 
      guest.tableId === tableId ? { ...guest, tableId: undefined } : guest
    );
    
    const updatedTables = details.tables.filter(table => table.id !== tableId);
    
    await setGuestDetails({
      guests: updatedGuests,
      tables: updatedTables
    });
  } catch (error) {
    console.error("Error deleting table:", error);
    throw error;
  }
};

export const setOnboardingComplete = async (completed: boolean = true) => {
  try {
    if (completed) {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, "true");
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
    }
  } catch (error) {
    console.error("Error setting onboarding state:", error);
  }
};

export const setWeddingDate = async (date: Date) => {
  try {
    const details: WeddingDetails = {
      weddingDate: date.toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.WEDDING_DETAILS, JSON.stringify(details));
  } catch (error) {
    console.error("Error saving wedding date:", error);
    throw error;
  }
};

export const getWeddingDetails = async (): Promise<WeddingDetails | null> => {
  try {
    const details = await AsyncStorage.getItem(STORAGE_KEYS.WEDDING_DETAILS);
    return details ? JSON.parse(details) : null;
  } catch (error) {
    console.error("Error getting wedding details:", error);
    throw error;
  }
};

export const getDaysUntilWedding = async (): Promise<number> => {
  try {
    const details = await getWeddingDetails();
    if (!details) {
      throw new Error("No wedding date set");
    }
    
    const weddingDate = new Date(details.weddingDate);
    const today = new Date();
    const diffTime = weddingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    console.error("Error calculating days until wedding:", error);
    throw error;
  }
};

export const checkIsFirstLaunch = async () => {
  try {
    const hasCompletedOnboarding = await AsyncStorage.getItem(
      STORAGE_KEYS.HAS_COMPLETED_ONBOARDING
    );
    return hasCompletedOnboarding === null;
  } catch (error) {
    console.error("Error checking first launch:", error);
    return false;
  }
};

export const setTotalBudget = async (amount: number) => {
  try {
    const details = await getBudgetDetails();
    const newDetails: BudgetDetails = details ? {
      ...details,
      totalBudget: amount
    } : {
      totalBudget: amount,
      items: []
    };
    await setBudgetDetails(newDetails);
  } catch (error) {
    console.error("Error setting total budget:", error);
    throw error;
  }
};

export const deleteBudgetItem = async (itemId: string) => {
  try {
    const details = await getBudgetDetails();
    if (!details) throw new Error("No budget details found");
    
    const updatedItems = details.items.filter(item => item.id !== itemId);
    await setBudgetDetails({
      ...details,
      items: updatedItems
    });
  } catch (error) {
    console.error("Error deleting budget item:", error);
    throw error;
  }
};

export const setBudgetDetails = async (details: BudgetDetails) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BUDGET_DETAILS, JSON.stringify(details));
  } catch (error) {
    console.error("Error saving budget details:", error);
    throw error;
  }
};

export const getBudgetDetails = async (): Promise<BudgetDetails | null> => {
  try {
    const details = await AsyncStorage.getItem(STORAGE_KEYS.BUDGET_DETAILS);
    return details ? JSON.parse(details) : null;
  } catch (error) {
    console.error("Error getting budget details:", error);
    throw error;
  }
};

export const addBudgetItem = async (item: BudgetItem) => {
  try {
    const details = await getBudgetDetails();
    const newDetails: BudgetDetails = details ? {
      ...details,
      items: [...details.items, item]
    } : {
      totalBudget: 0,
      items: [item]
    };
    await setBudgetDetails(newDetails);
  } catch (error) {
    console.error("Error adding budget item:", error);
    throw error;
  }
};

export const updateBudgetItem = async (itemId: string, updates: Partial<BudgetItem>) => {
  try {
    const details = await getBudgetDetails();
    if (!details) throw new Error("No budget details found");
    
    const updatedItems = details.items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    
    await setBudgetDetails({
      ...details,
      items: updatedItems
    });
  } catch (error) {
    console.error("Error updating budget item:", error);
    throw error;
  }
};

export const setTimelineDetails = async (details: TimelineDetails) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TIMELINE_DETAILS, JSON.stringify(details));
  } catch (error) {
    console.error("Error saving timeline details:", error);
    throw error;
  }
};

export const getTimelineDetails = async (): Promise<TimelineDetails | null> => {
  try {
    const details = await AsyncStorage.getItem(STORAGE_KEYS.TIMELINE_DETAILS);
    return details ? JSON.parse(details) : null;
  } catch (error) {
    console.error("Error getting timeline details:", error);
    throw error;
  }
};

export const initializeTimeline = async () => {
  try {
    const details = await getTimelineDetails();
    if (!details) {
      const initialCategories: TimelineDetails['categories'] = {
        ceremony: { isEnabled: true, order: 0 },
        reception: { isEnabled: true, order: 1 },
        attire: { isEnabled: true, order: 2 },
        beauty: { isEnabled: true, order: 3 },
        flowers: { isEnabled: true, order: 4 },
        photography: { isEnabled: true, order: 5 },
        music: { isEnabled: true, order: 6 },
        transportation: { isEnabled: true, order: 7 },
        honeymoon: { isEnabled: true, order: 8 },
        legal: { isEnabled: true, order: 9 },
        other: { isEnabled: true, order: 10 }
      };
      
      await setTimelineDetails({
        tasks: [],
        categories: initialCategories
      });
    }
  } catch (error) {
    console.error("Error initializing timeline:", error);
    throw error;
  }
};

export const addTimelineTask = async (task: Omit<TimelineTask, 'id'>) => {
  try {
    const details = await getTimelineDetails();
    if (!details) await initializeTimeline();
    
    const newTask: TimelineTask = {
      ...task,
      id: Date.now().toString()
    };
    
    const updatedDetails = details ? {
      ...details,
      tasks: [...details.tasks, newTask]
    } : {
      tasks: [newTask],
      categories: {} as TimelineDetails['categories']
    };
    
    await setTimelineDetails(updatedDetails);
    return newTask;
  } catch (error) {
    console.error("Error adding timeline task:", error);
    throw error;
  }
};

export const updateTimelineTask = async (taskId: string, updates: Partial<TimelineTask>) => {
  try {
    const details = await getTimelineDetails();
    if (!details) throw new Error("No timeline details found");
    
    const updatedTasks = details.tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    await setTimelineDetails({
      ...details,
      tasks: updatedTasks
    });
  } catch (error) {
    console.error("Error updating timeline task:", error);
    throw error;
  }
};

export const deleteTimelineTask = async (taskId: string) => {
  try {
    const details = await getTimelineDetails();
    if (!details) throw new Error("No timeline details found");
    
    const updatedTasks = details.tasks.filter(task => task.id !== taskId);
    
    await setTimelineDetails({
      ...details,
      tasks: updatedTasks
    });
  } catch (error) {
    console.error("Error deleting timeline task:", error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
  try {
    const details = await getTimelineDetails();
    if (!details) throw new Error("No timeline details found");
    
    const updatedTasks = details.tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status,
            completedDate: status === 'completed' ? new Date().toISOString() : undefined
          } 
        : task
    );
    
    await setTimelineDetails({
      ...details,
      tasks: updatedTasks
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

export const updateCategoryOrder = async (categoryId: TaskCategory, newOrder: number) => {
  try {
    const details = await getTimelineDetails();
    if (!details) throw new Error("No timeline details found");
    
    const updatedCategories = {
      ...details.categories,
      [categoryId]: {
        ...details.categories[categoryId],
        order: newOrder
      }
    };
    
    await setTimelineDetails({
      ...details,
      categories: updatedCategories
    });
  } catch (error) {
    console.error("Error updating category order:", error);
    throw error;
  }
};

export const toggleCategoryVisibility = async (categoryId: TaskCategory) => {
  try {
    const details = await getTimelineDetails();
    if (!details) throw new Error("No timeline details found");
    
    const updatedCategories = {
      ...details.categories,
      [categoryId]: {
        ...details.categories[categoryId],
        isEnabled: !details.categories[categoryId].isEnabled
      }
    };
    
    await setTimelineDetails({
      ...details,
      categories: updatedCategories
    });
  } catch (error) {
    console.error("Error toggling category visibility:", error);
    throw error;
  }
};
