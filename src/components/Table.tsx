import React, { useState, useEffect } from 'react';

export interface ColumnDef<T> {
  header: string;
 //fieldKey: keyof T;
 fieldKey: keyof T | ((row: T, index: number) => React.ReactNode);
// fieldKey, basit metin gösterimi için kullanılır.
// 'keyof T' T tipinin anahtarlarından biri olmasını zorunlu kılar, bu da tip güvenliği sağlar.
  //renderCell?: (row: T,index: number) => React.ReactNode;// renderCell, hücre içinde buton, renkli etiket gibi özel içerikler göstermek için kullanılıyor
  
}

interface TableProps<T> {// T tipinin id alanına sahip olmasını zorunlu kılar
    columns: ColumnDef<T>[];//kaç elema tanımlarsak o kadar kolon oluşturur ve bu bize dinamik kolon oluşturma imkanı verir
    //'T[]' generic olarak veri tipiyle ilgili esneklik sağlar
    data?: T[];
    emptyDataText?: string;
    onRowClick?: (rowData: T) => void;
}



export function Table<T>({ columns, data = [], emptyDataText = "Gösterilecek veri yok", onRowClick }: TableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [ inputValue, setInputValue ] = useState('');// inputun değerini tutar

    // Arama terimine göre veriyi filtrele

    /* const filteredData = data.filter((row) => {
        if (!searchTerm) {// arama terimi boşsa tüm verileri göster
            return true;
        }
        return columns.some((col) => {// her kolon için arama yapar. some, en az bir kolonun eşleşmesi durumunda true döner
            const fieldKey = col.fieldKey;// kolonun fieldKey'si alınır
            const value = fieldKey ? row[fieldKey] : null;// fieldKey varsa değeri al, yoksa null

            if (fieldKey) {
                return String(value).toLowerCase().includes(searchTerm.toLowerCase());// değeri stringe çevir, küçük harfe dönüştür ve arama terimiyle karşılaştır.
            }
            return false;
        });
    }); */


        useEffect(() => {
            
            console.log(`Zamanlayıcı kuruldu... Değer: "${inputValue}"`);

            const timer = setTimeout(() => {//bir tane zamanlayıcı kuruluyor.   
                console.warn(`FİLTRELEME TETİKLENDİ! Arama terimi: "${inputValue}"`);  
                setSearchTerm(inputValue);
            }, 500); // 500ms gecikme ile çalışır her input değişiminden sonra süre tekrar baştan başlar
 
            return () => {
                clearTimeout(timer);// Temizleme fonksiyonu: Bu fonksiyon, inputValue her değiştiğinde bir sonraki
            // effect çalışmadan hemen önce çalışır. Böylece eski zamanlayıcıyı temizler.
            };
        }, [inputValue]); 

        const filteredData = data.filter((row) => {
            if (!searchTerm) {// arama terimi boşsa tüm verileri göster
                return true;
            }

            return columns.some((col) => {// her kolon için arama yapar. some, en az bir kolonun eşleşmesi durumunda true döner
                let value: unknown;
                if (typeof col.fieldKey === "function") {
                    value = col.fieldKey(row, 0); // index önemsiz, arama için sadece stringleştiriyoruz
                } else {
                    value = row[col.fieldKey];
                }
                return String(value ?? "").toLowerCase().includes(searchTerm.toLowerCase());
            });
        });

    return (
        
        <div className="bg-white rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.1)] overflow-x-auto">{/* tablo kapsayıcısı */}
            <input
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 text-sm mb-4"
                type="text"
                placeholder="Ara..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <table className="w-full border-collapse">
                
                <thead>
                    
                    <tr className="bg-slate-200">
                        {columns.map((col, index) => (// kolon başlıklarını oluşturur
                            <th key={`${col.header}-${index}`} className="bg-slate-200 p-3 text-left font-semibold">{/* her başlık için th elementi*/}
                                {col.header}
                            </th>
                        ) )}
                    </tr>  
                </thead> 

               
                    <tbody>
                        {/* Veri olup olmadığını "filteredData" üzerinden kontrol ediyoruz */}
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center text-gray-500 p-4">
                                    {/* Arama sonucu bir şey bulunamadığında da bu mesaj gösterilecek */}
                                    {searchTerm ? "Arama sonucuyla eşleşen veri bulunamadı" : emptyDataText}
                                </td>
                            </tr>
                        ) : (
                            /* Ekrana basılacak veriyi "filteredData" üzerinden map'liyoruz */
                            filteredData.map((row, rowIndex) => (// filtrelenmiş veriyi satır satır oluşturur. rowIndex, satır numarasını almak için kullanılır. key olarak row.id kullanılır.
                                <tr
                                    key={row.id}// her satır için benzersiz anahtar
                                    onClick={() => onRowClick && onRowClick(row)}// satır tıklama olayını tetikler
                                    className={onRowClick ? "cursor-pointer hover:bg-gray-100 transition" : ""}// satırın tıklanabilir olup olmadığını belirler
                                >
                                    {columns.map((col, colIndex) => (// her satır için kolonları oluşturur
                                        <td key={`${col.header}-${colIndex}`} className="p-3 border-b border-slate-100">
                                        
                                        {typeof col.fieldKey === "function"
                                            ? col.fieldKey(row, rowIndex)
                                            : String(row[col.fieldKey] ?? "")}{/* fieldKey kullanarak hücre içeriğini alır */}
                                        
                                        
                                    </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
            </table>
        </div>
    );
}
