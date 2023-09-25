import CanvasJSReact from '@canvasjs/react-charts';
import React, { useEffect, useState } from 'react';
import './App.css';

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
				const parsedData = data.map((item) => ({
					x: new Date(item.date), // Date format depends on your API response
					y: parseFloat(item.price), // Parse the price value from the API response
				}));
				setDataPoints(parsedData);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

	
	const lastDataPoint = dataPoints[dataPoints.length - 1];
	const formatDate = (date) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		let formattedDate = date.toLocaleDateString(undefined, options);
		formattedDate = formattedDate.replace(',', '');
		const [day, month, year] = formattedDate.split(' ');
		return ` ${month} ${day}, ${year}`;
	};
	const tooltipContentFormatter = (e) => {
		const tooltipContent = e.entries
			.map(
				(entry) =>
					`<div style="background-color: #F0F0F0; padding: 10px; border: 1px solid #CCCCCC;">
         <span >${entry.dataSeries.name}:</span> ${entry.dataPoint.y}<br />
         <span >Date:</span> ${formatDate(entry.dataPoint.x)}<br />
       </div>`
			)
			.join('');

		return tooltipContent;
	};

	const options = {
		theme: 'light2',
		animationEnabled: true,
		zoomEnabled: true,
		title: {
			text: '',
		},
		axisX: {
			title: 'Date',
			valueFormatString: 'DD MMM YYYY',
			minimum: dataPoints[0]?.x,

			labelFontSize: 10,
			titleFontSize: 16,
			gridThickness: 1,
			tickLength: 10,

			gridColor: '#DCDCDD',
		},
		axisY: {
			title: 'Price BDT',
			labelFontSize: 10,
			titleFontSize: 16,
			gridColor: '#DCDCDD',
			/* includeZero: false, */
		},
		toolTip: {
			content: tooltipContentFormatter,
		},

		data: [
			{
				type: 'splineArea',
				color: lastDataPoint?.y < 240 ? '#F2B1B1' : '#D4EAEA',
				dataPoints: dataPoints,
				//color: lastDataPoint?.y < 240 ? '#F2B1B1' : '#D4EAEA',
				lineColor: lastDataPoint?.y < 240 ? '#D60D0D' : '#2C7C7A',
				markerColor: 'transparent',
				name: 'Price', // Add a name for the data series
			},
			{
				type: 'line', // Add a new line series for the threshold line
				showInLegend: false,
				markerType: 'none',
				dataPoints: [
					{ x: dataPoints[0]?.x, y: 250 },
					{ x: dataPoints[dataPoints.length - 1]?.x, y: 250 },
				],
				color: lastDataPoint?.y < 240 ? '#D60D0D' : '#2C7C7A',
				lineDashType: 'longDash',
				lineThickness: 1,
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
		<div className="graph-area">
			<div className="chart-container" style={{ marginTop: '5rem' }}>
				{dataPoints.length > 0 ? (
					<CanvasJSChart options={options} />
				) : (
					<p>data loding...</p>
				)}
			</div>
		</div>
	);
};

export default App;
