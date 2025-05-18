import React from 'react';
import Layout from '../template/Layout';
import ManageUser from '../components/ManageUser';
import useUser from '../hook/useUser';

const UserPage = () => {
  const [users, loading, addUser, updateUser] = useUser();

  return (
    <Layout>
      {loading ? (
        <span className="flex justify-center font-bold">Please wait...</span>
      ) : (
        <ManageUser users={users} addUser={addUser} updateUser={updateUser} />
      )}
    </Layout>
  );
};

export default UserPage;