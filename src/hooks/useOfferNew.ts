import { useState } from "react";
import { offerSchema, type OfferFormData } from '../schemas/validationSchemas';
import { v4 as uuidv4 } from "uuid";


export const useOfferNew = () => {

  const [offers, setOffers] = useState<OfferFormData[]>([]);
  const [selectedOffers, setSelectedOffersId] = useState<Set<string>>(new Set());

  
  /* const addOffer = () => {
    const newItem: OfferFormData = {
      id: uuidv4(),
      customerName: '',
      offerName: '',
      offerDate: new Date().toISOString().split('T')[0],
      offerStatus: 'Taslak',
      items: [],
      subTotal: 0,
      discountTotal: 0,
      vatTotal: 0,
      grandTotal: 0,
      isActive: true,
    };
    setOffers((prev) => [...prev, newItem]);
  }; */

  const addOffer = (newOffer: OfferFormData) => {
    
    const offerWithId = { ...newOffer, id: newOffer.id || uuidv4() };
    
    setOffers((prev) => [...prev, offerWithId]);
  };

  const updateOffer = (updatedItem: OfferFormData) => {
    setOffers((prev) =>
      prev.map((offer) => // 'offers' -> 'offer' (map içindeki tekil öğe)
        offer.id === updatedItem.id ? updatedItem : offer
      )
    );
  };

  
  const handleDeleteOffer = (idToDelete: string) => { // 'itemId' -> 'idToDelete' (daha net)
    setOffers((prev) =>
      prev.map((offerInMap) => // 'setOffers' -> 'offerInMap' (kapsam karmaşasını önler)
        offerInMap.id === idToDelete // 'offersId' -> 'id', 'offerId' -> 'idToDelete'
          ? { ...offerInMap, isActive: !offerInMap.isActive } // 'offer' -> 'offerInMap', 'isActiveLine' -> 'isActive'
          : offerInMap // 'offer' -> 'offerInMap'
      )
    );
  };

  
  const toggleItemSelection = (offerId: string) => { 
    setSelectedOffersId((prev) => {
      const newSet = new Set(prev);
      newSet.has(offerId) ? newSet.delete(offerId) : newSet.add(offerId);
      return newSet;
    });
  };

 
  return {
    offers, 
    addOffer, 
    updateOffer, 
    handleDeleteOffer, 
    toggleItemSelection,
    selectedOffers,
    setOffers,
    //setSelectedItemsId,
  };
};

// export default useOfferItems