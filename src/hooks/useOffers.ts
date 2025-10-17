import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { RootState, AppDispatch } from '../redux/store';
import { addOffer, updateOffer, deleteOffer, deleteOfferLine, type OfferItem, type DeleteLinePayload } from '../redux/offersSlice';

// Custom hook for offers management
export const useOffers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const offers = useSelector((state: RootState) => state.offers.offers);
  const activeOffers = useSelector((state: RootState) => state.offers.offers.filter(offer => offer.isActive));

  const addNewOffer = useCallback((offer: OfferItem) => {
    dispatch(addOffer(offer));
  }, [dispatch]);

  const updateExistingOffer = useCallback((offer: OfferItem) => {
    dispatch(updateOffer(offer));
  }, [dispatch]);

  const softDeleteOffer = useCallback((offerId: string) => {
    dispatch(deleteOffer(offerId));
  }, [dispatch]);

  const softDeleteOfferLine = useCallback((payload: DeleteLinePayload) => {// burada payload kullandık çünkü hem offerId hem de lineItemId gerekiyor
    dispatch(deleteOfferLine(payload));
  }, [dispatch]);

  const getOfferById = useCallback((id: string) => {
    return offers.find(offer => offer.id === id);
  }, [offers]);

  return {
    offers,
    activeOffers,
    addNewOffer,
    updateExistingOffer,
    softDeleteOffer,
    softDeleteOfferLine,
    getOfferById,
  };
};
