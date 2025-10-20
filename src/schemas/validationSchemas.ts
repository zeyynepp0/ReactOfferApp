import { z } from 'zod';

// Login form validation schema
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Kullanıcı adı zorunludur')
    .max(50, 'Kullanıcı adı çok uzun'),
  password: z.string()
    .min(1, 'Şifre zorunludur')
    .max(100, 'Şifre çok uzun')
});

// Offer form validation schemas
export const offerLineItemSchema = z.object({
  //id: z.string().optional(),
  itemId: z.string().min(1, 'Item ID zorunludur'),
  itemType: z.enum(['Malzeme', 'Hizmet']),
  materialServiceName: z.string()
    .min(1, 'Ad zorunludur')
    .max(200, 'Ad çok uzun')
    .refine((val) => !/^\d+$/.test(val.trim()), 'Ad sadece sayı olamaz'),
  quantity: z.number()
    .min(0.01, 'Miktar 0\'dan büyük olmalıdır')
    .max(999999, 'Miktar çok büyük'),
  unitPrice: z.number()
    .min(0, 'Tutar negatif olamaz')
    .max(999999999, 'Tutar çok büyük'),
  discountAmount: z.number()
    .min(0, 'İndirim negatif olamaz')
    .max(100, 'İndirim % 100\'den fazla olamaz'),
  discountUnit: z.number()
    .min(0, 'İndirim birimi negatif olamaz')
    .max(999999999, 'İndirim birimi çok büyük'),
  discountPercentage: z.number()
    .min(0, 'İndirim yüzdesi negatif olamaz')
    .max(100, 'İndirim yüzdesi 100\'den fazla olamaz'),
  kdv: z.union([
    z.literal(0.08),
    z.literal(0.18),
    z.literal(0.20)
  ], {
    message: 'Geçerli bir KDV oranı seçiniz (8%, 18%, 20%)'
  }),
  
  lineTotal: z.number().min(0),
  lineDiscount: z.number().min(0),
  lineVat: z.number().min(0),
  totalPrice: z.number().min(0),
  isActiveLine: z.boolean()
});


export const offerSchema = z.object({
  id: z.string().optional(),
  customerName: z.string()
    .min(1, 'Müşteri Adı zorunludur')
    .max(200, 'Müşteri Adı çok uzun')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Müşteri Adı sadece harf içerebilir'),
  offerName: z.string()
    .min(1, 'Teklif Adı zorunludur')
    .max(200, 'Teklif Adı çok uzun'),
  offerDate: z.string()
    .min(1, 'Tarih zorunludur')
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Geçerli bir tarih giriniz'),
  offerStatus: z.enum(['Taslak', 'Onay Bekliyor', 'Onaylandı']),
  items: z.array(offerLineItemSchema)
    //.min(1, 'En az bir satır eklemelisiniz')
    .max(100, 'Çok fazla satır eklenemez'),
  subTotal: z.number().min(0),
  discountTotal: z.number().min(0),
  vatTotal: z.number().min(0),
  grandTotal: z.number().min(0),
  isActive: z.boolean()
});



//typescript türleri için şemalardan çıkarımlar
export type LoginFormData = z.infer<typeof loginSchema>;
export type OfferFormData = z.infer<typeof offerSchema>;
//export type OfferLineItemFormData = z.infer<typeof offerLineItemSchema>;
export type OfferLineItemFormData = z.infer<typeof offerLineItemSchema>;

//validation fonksiyonları
export const validateLogin = (data: unknown) => {
  return loginSchema.safeParse(data);
};

export const validateOffer = (data: unknown) => {// teklif verilerini doğrulama fonksiyonu
  return offerSchema.safeParse(data);
};

export const validateOfferLineItem = (data: unknown) => {// teklif satır öğesi verilerini doğrulama fonksiyonu
  return offerLineItemSchema.safeParse(data);
};


export const formatZodErrors = (errors: z.ZodError): string[] => { // Zod hata nesnesini okunabilir hata mesajlarına dönüştürme fonksiyonu
  return errors.issues.map(error => {
    const path = error.path.join('.');
    return path ? `${path}: ${error.message}` : error.message;
  });
};

