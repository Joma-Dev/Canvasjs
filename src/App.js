import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import "./App.css";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const App = () => {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/demo.json'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Assuming the API response is an array of objects with date and price properties
        const parsedData = data.map(item => ({
          x: new Date(item.date), // Date format depends on your API response
          y: parseFloat(item.price) // Parse the price value from the API response
        }));
        setDataPoints(parsedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    theme: 'light2',
    animationEnabled: true,
		zoomEnabled: true,
    title: {
      text: 'Price Over the Last 3 Years',
    },
    axisX: {
      title: 'Date',
      valueFormatString: 'MMM YY',
    },
    axisY: {
      title: 'Price BDT',
      includeZero: false,
    },
    toolTip: {
      fontColor: 'red', 
    },
    data: [
      {
        type: 'area',
        dataPoints: dataPoints,
        color: '#D4EAEA',
        lineColor: '#56ABAA',
        markerColor: 'transparent',
      },
    ],
  };

/*   const customToolTipContent = (e) => {
    const date = e.entries[0].dataPoint.x;
    const price = e.entries[0].dataPoint.y;
    
    return `<div style="background-color: #F0F0F0; padding: 10px; border: 1px solid #CCCCCC;">
              <span style="font-weight: bold;">Date:</span> ${date}<br/>
              <span style="font-weight: bold;">Price:</span> ${price} BDT
            </div>`;
  };
 */
  return (
    <div className="chart-container">
      <CanvasJSChart options={options} />
    </div>
  );
};

export default App;
