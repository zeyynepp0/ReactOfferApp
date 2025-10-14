import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';



// Temel tipler
export type KDV = 0.08 | 0.18 | 0.20;
export type OfferStatus = 'Taslak' | 'Onay Bekliyor' | 'Onaylandı';
export type ItemType = 'Malzeme' | 'Hizmet';

// Teklif üst bilgileri ve toplamlar
export interface OfferItem {
  id: string;
  customerName: string;
  offerName: string;
  offerDate: string;
  offerStatus: OfferStatus;
  items: OfferLineItem[];

  subTotal: number; 
  discountTotal: number; 
  vatTotal: number; 
  grandTotal: number; 
}

// Teklif satır yapısı
export interface OfferLineItem {
  itemId: string;
  itemType: ItemType;
  materialServiceName: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  kdv: KDV;

  lineTotal: number; 
  lineDiscount: number; 
  lineVat: number; 
  totalPrice: number;
}

// Slice state
interface OffersState {
  offers: OfferItem[];
}

const initialState: OffersState = {
  offers: [],
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    addOffer(state, action: PayloadAction<OfferItem>) {
      state.offers.push(action.payload);
    },
    updateOffer(state, action: PayloadAction<OfferItem>) {
      const index = state.offers.findIndex(o => o.id === action.payload.id);
      if (index >= 0) state.offers[index] = action.payload;
    },
    deleteOffer(state, action: PayloadAction<string>) {
      state.offers = state.offers.filter(o => o.id !== action.payload);
    },
  },
});

export const { addOffer, updateOffer, deleteOffer } = offersSlice.actions;
export default offersSlice.reducer;
