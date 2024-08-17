import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const formatYAxisTick = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(0)}B`; // Display in billions
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M`; // Display in millions
  }
  return value;
};

const sortByYear = (data: any[]) => {
  return data.slice().sort((a, b) => Number(a.year) - Number(b.year));
};

const filterDataByPeriod = (data: any[], period: string) => {
  const currentYear = new Date().getFullYear();
  const years = period === 'Full' ? Infinity : parseInt(period);
  return data.filter(item => {
    const year = parseInt(item.year);
    return year >= currentYear - years;
  });
};

const Gdp_Population = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Full');

  const gdpData = useSelector((state: RootState) => state.data.gdpData);
  const populationData = useSelector((state: RootState) => state.data.populationData);
  const gdpPerCapitaData = useSelector((state: RootState) => state.data.gdpPerCapitaData);

  if (!gdpData || !populationData || !gdpPerCapitaData) {
    return <div>No data available.</div>;
  }

  const formattedGdpData = useMemo(() => {
    return sortByYear(gdpData.map((item: { year: any; value: any; }) => ({
      year: item.year,
      gdp: item.value,
    })));
  }, [gdpData]);

  const formattedPopulationData = useMemo(() => {
    return sortByYear(populationData.map((item: { year: any; value: any; }) => ({
      year: item.year,
      population: item.value,
    })));
  }, [populationData]);

  const formattedGdpPerCapitaData = useMemo(() => {
    return sortByYear(gdpPerCapitaData.map((item: { year: any; value: any; }) => ({
      year: item.year,
      gdpPerCapita: item.value,
    })));
  }, [gdpPerCapitaData]);

  const filteredGdpData = useMemo(() => filterDataByPeriod(formattedGdpData, selectedPeriod), [selectedPeriod, formattedGdpData]);
  const filteredPopulationData = useMemo(() => filterDataByPeriod(formattedPopulationData, selectedPeriod), [selectedPeriod, formattedPopulationData]);
  const filteredGdpPerCapitaData = useMemo(() => filterDataByPeriod(formattedGdpPerCapitaData, selectedPeriod), [selectedPeriod, formattedGdpPerCapitaData]);

  const gdpValues = filteredGdpData.map(item => item.gdp);
  const minGdp = Math.min(...gdpValues);
  const maxGdp = Math.max(...gdpValues);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600">Macroeconomic Data</h1>

      <div className="flex flex-wrap justify-center space-x-2 md:space-x-4 mb-4">
        {['5', '10', 'Full'].map(period => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`py-2 px-4 rounded ${selectedPeriod === period ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Last {period === 'Full' ? 'All' : period} years
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-lg h-[200px] md:h-[300px]" key="gdp-chart">
          <h2 className="text-lg md:text-2xl font-semibold mb-2 text-blue-600">Historical GDP of Kenya</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredGdpData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value: any) => formatYAxisTick(value).toString()} domain={[minGdp * 0.9, maxGdp * 1.1]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="gdp" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg h-[200px] md:h-[300px]" key="population-chart">
          <h2 className="text-lg md:text-2xl font-semibold mb-2 text-blue-600">Historical Population of Kenya</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredPopulationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value: any) => formatYAxisTick(value).toString()} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="population" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg h-[200px] md:h-[300px]" key="gdp-per-capita-chart">
          <h2 className="text-lg md:text-2xl font-semibold mb-2 text-blue-600">Historical GDP per Capita of Kenya</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredGdpPerCapitaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value: any) => formatYAxisTick(value).toString()} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="gdpPerCapita" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Gdp_Population;
