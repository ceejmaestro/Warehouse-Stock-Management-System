import React from 'react';
import Layout from '../template/Layout';
import ManageInventory from '../components/ManageInventory';
import useItem from '../hook/useInventory';


const InventoryPage = () => {
  const [items, loading] = useItem();

  return (
    <Layout>
      {loading ? (
        <span className="flex justify-center font-bold">Please wait...</span>
      ) : (
        <ManageInventory items={items} />
      )}
    </Layout>
  );
};

export default InventoryPage;
