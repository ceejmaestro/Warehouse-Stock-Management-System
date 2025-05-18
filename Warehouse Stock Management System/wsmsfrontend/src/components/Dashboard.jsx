import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function Dashboard() {

  const [userCount, setUserCount] = useState(null);
  const [itemCount, setItemCount] = useState(null);
  const [distribCount, setDistribCount] = useState(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/api/users/', {
          withCredentials: true,
        });
        setUserCount(response.data.length);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUserCount();
  }, []);

  useEffect(() => {
    const fetchItemCount = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/api/items/', {
          withCredentials: true,
        });
        setItemCount(response.data.length);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItemCount();
  }, []);

  useEffect(() => {
    const fetchDistribCount = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/api/distribs/', {
          withCredentials: true,
        });
        setDistribCount(response.data.length);
      } catch (error) {
        console.error('Error fetching distributions:', error);
      }
    };
    fetchDistribCount();
  }, []);

  const chartOptions = {
    animationEnabled: true,
    theme: "light2",
    backgroundColor: "#fff",
    title: {
      text: "Inventory Overview",
      fontSize: 24,
      fontColor: "black",
      fontWeight: "bold"
    },
    axisX: {
      title: "Category",
      labelFontSize: 14,
    },
    axisY: {
      title: "Stock",
      minimum: 1,
      maximum: 10,
      interval: 1,
      labelFontSize: 14,
    },
    data: [{
      type: "column",
      dataPointWidth: 20,
      indexLabel: "{y}",
      indexLabelFontSize: 14,
      indexLabelPlacement: "outside",
      color: "#F3A026",
      dataPoints: [
        { label: "Food and other consumables" },
        { label: "Fabric Enhancers" },
        { label: "Body Care" },
        { label: "Home Care" },
        // { label: "Sample", y: itemCount || 0 } // Uncomment to add dynamic data points
      ]
    }]
  };

  return (
    <div>
      <div className="flex justify-center flex-wrap">
        <div className="mt-10 ml-10">
          <div className="w-80 rounded-2xl overflow-hidden shadow-xl border border-black bg-white transition-transform duration-200">
            <div className="flex items-center justify-between bg-amber-500 text-black px-5 py-4">
              <h3 className="text-xl font-extrabold tracking-wider">Total Users</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-10">
              <div className="text-2xl font-bold text-black">
                {userCount !== null ? userCount : 'Loading...'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 ml-10">
          <div className="w-80 rounded-2xl overflow-hidden shadow-xl border border-black bg-white transition-transform duration-200">
            <div className="flex items-center justify-between bg-amber-500 text-black px-5 py-4">
              <h3 className="text-xl font-extrabold tracking-wider">Total Items</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-10">
              <div className="text-2xl font-bold text-black">
                {itemCount !== null ? itemCount : 'Loading...'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 ml-10">
          <div className="w-80 rounded-2xl overflow-hidden shadow-xl border border-black bg-white transition-transform duration-200">
            <div className="flex items-center justify-between bg-amber-500 text-black px-5 py-4">
              <h3 className="text-xl font-extrabold tracking-wider">Total Distributions</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-10">
              <div className="text-2xl font-bold text-black">
                {distribCount !== null ? distribCount : 'Loading...'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 px-10 w-full mb-5">
        <div className="bg-white border rounded-2xl shadow-lg p-6 w-full">
          <CanvasJSChart
            options={chartOptions}
            containerProps={{ width: "100%", height: "400px" }}
          />
        </div>
      </div>
    </div>
  );
}
