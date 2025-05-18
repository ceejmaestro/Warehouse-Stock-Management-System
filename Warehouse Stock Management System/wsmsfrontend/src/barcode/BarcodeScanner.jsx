import React from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

const BarcodeScanner = ({ onScan, onClose }) => {
  const [data, setData] = React.useState('No result');
  const [scanning, setScanning] = React.useState(true);

  React.useEffect(() => {
    if (data && data !== 'No result') {
      onScan(data);
      setScanning(false);
      onClose();
    }
  }, [data, onScan, onClose]);

  return (
    <>
      {scanning && (
        <BarcodeScannerComponent
          onUpdate={(err, result) => {
            if (result) {
              setData(result.text);
            } else {
              setData('No result');
            }
          }}
          style={{ width: '100%' }}
        />
      )}
    </>
  );
};

export default BarcodeScanner;