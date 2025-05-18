import React from 'react';
import Layout from '../template/Layout';
import ManageDistrib from '../components/ManageDistrib';
import useDistrib from '../hook/useDistrib';
import useItem from '../hook/useInventory';

const DistribPage = () => {
  const { distribs, groupedProducts, loading, addDistrib } = useDistrib();
  const [items] = useItem();

  return (
    <Layout>
      {loading ? (
        <span className="flex justify-center font-bold">Please wait...</span>
      ) : (
        <ManageDistrib
          items={items}
          distribs={distribs}
          groupedProducts={groupedProducts}
          addDistrib={addDistrib}
        />
      )}
    </Layout>
  );
};

export default DistribPage;
