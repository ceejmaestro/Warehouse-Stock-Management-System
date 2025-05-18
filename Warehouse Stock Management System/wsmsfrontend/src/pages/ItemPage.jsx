import React, { useState } from 'react';
import Layout from '../template/Layout';
import ManageItem from '../components/ManageItem';
import useItem from '../hook/useItem';
import BarcodeScanner from '../barcode/BarcodeScanner';

const ItemPage = () => {
  const [items, loading, addItem, updateItem] = useItem();
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [isUpdateItemOpen, setIsUpdateItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleScan = (scannedBarcode) => {
    const foundItem = items.find(item => item.barcode_no === scannedBarcode);
    if (foundItem) {
      setSelectedItem(foundItem);
      setIsUpdateItemOpen(true);
    } else {
      alert('Item with scanned barcode not found.');
    }
    setIsBarcodeScannerOpen(false);
  };

  return (
    <Layout>
      {loading ? (
        <span className="flex justify-center font-bold">Please wait...</span>
      ) : (
        <ManageItem
          items={items}
          addItem={addItem}
          updateItem={updateItem}
          isUpdateItemOpen={isUpdateItemOpen}
          setIsUpdateItemOpen={setIsUpdateItemOpen}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      )}
      {isBarcodeScannerOpen && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setIsBarcodeScannerOpen(false)}
        />
      )}
    </Layout>
  );
};

export default ItemPage;
