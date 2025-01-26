import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axiosInstance from '../../utils/axiosInstance';

const options: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE', '#FF6F61'], // Added a third color (#FF6F61)
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ['Mon', 'Tus', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',
    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartTwo: React.FC = () => {
  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: 'Chat Request',
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Call Request',
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Video Call Request',
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response] = await Promise.all([axiosInstance.get<any>('/admin/callchats/counts')]);

        setState({
          series: [
            {
              name: 'Chat Request',
              data: response.data.chatCount,
            },
            {
              name: 'Video Call Request',
              data: response.data.videoCallsCount,
            },
            {
              name: 'Call Request',
              data: response.data.AudiocallsCount,
            },
          ],
        });
      } catch (error: any) {
        console.error('Error fetching dashboard counts:', error.response?.data || error.message);
      }
    };

    fetchData();
  }, []); // Runs once on component mount  

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Total Request
          </h4>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
