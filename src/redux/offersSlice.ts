import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';



// Temel tipler
export type KDV = 0.08 | 0.18 | 0.20;
export type OfferStatus = 'Taslak' | 'Onay Bekliyor' | 'Onaylandı';
export type ItemType = 'Malzeme' | 'Hizmet';

// DeleteLinePayload tipi
export interface DeleteLinePayload {
  offerId: string;
  itemId: string;
}

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

  isActive: boolean; 
}

// Teklif satır yapısı
export interface OfferLineItem {
  itemId: string;
  itemType: ItemType;
  materialServiceName: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  discountUnit: number
  discountPercentage: number;
  kdv: KDV;

  lineTotal: number; 
  lineDiscount: number; 
  lineVat: number; 
  totalPrice: number;

  isActiveLine: boolean; 
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
    addOffer(state, action: PayloadAction<OfferItem>) {// yeni teklif ekleme işlemi
      state.offers.push(action.payload);
    },
    updateOffer(state, action: PayloadAction<OfferItem>) {
      // Doğrudan state'i değiştirmek yerine yeni bir dizi döndür
      state.offers = state.offers.map(offer =>
        offer.id === action.payload.id ? action.payload : offer
      );
    },

    deleteOffer(state, action: PayloadAction<string>) {// PayloadAction içindeki string, silinecek teklifin ID'sini temsil eder
      const offerIdToDelete = action.payload;
      const offer = state.offers.find(o => o.id === offerIdToDelete);
      if (offer) {
        offer.isActive = false;
      }
    },
    deleteOfferLine(state, action: PayloadAction<DeleteLinePayload>) {
      const { offerId, itemId } = action.payload;// Silinecek teklif satırının teklif ID'si ve satır ID'si
      const offer = state.offers.find(o => o.id === offerId);// İlgili teklifi bul

      if (offer) {
        const lineItem = offer.items.find(item => item.itemId === itemId);// İlgili teklif satırını bul
        if (lineItem) {// Teklif satırını pasif yap
          lineItem.isActiveLine = false;// Teklif satırını pasif yap
        }
      }
    },
  },
});

export const { addOffer, updateOffer, deleteOffer,deleteOfferLine } = offersSlice.actions;
export default offersSlice.reducer;
