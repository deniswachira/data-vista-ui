import  { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { dataApi } from "../../features/api/dataApiSlice";

// Helper function to format Y-axis ticks for large values
const formatYAxisTick = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(0)}B`; // Display in billions
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M`; // Display in millions
  }
  return value;
};

// Helper function to sort data by year in ascending order
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

  const { data: gdpData, isError: gdpIsError, isLoading: gdpIsLoading } = dataApi.useGetGdpQuery(1, {});
  const { data: populationData, isError: populationIsError, isLoading: populationIsLoading } = dataApi.useGetPopulationQuery(1, {});
  const { data: gdpPerCapitaData, isError: gdpPerCapitaIsError, isLoading: gdpPerCapitaIsLoading } = dataApi.useGetGdpPerCapitaQuery(1, {});

  // Handle loading and error states
  if (gdpIsLoading || populationIsLoading || gdpPerCapitaIsLoading) {
    return <div>Loading...</div>;
  }

  if (gdpIsError || populationIsError || gdpPerCapitaIsError) {
    return <div>Error loading data.</div>;
  }

  // Process and sort data
  const formatData = (data: any[]) => {
    return sortByYear(data.map(item => ({
      year: item.year,
      gdp: item.value,
      population: item.value,
      gdpPerCapita: item.value,
    })));
  };

  const formattedGdpData = formatData(gdpData);
  const formattedPopulationData = formatData(populationData);
  const formattedGdpPerCapitaData = formatData(gdpPerCapitaData);

  // Filter data based on the selected period
  const filteredGdpData = useMemo(() => filterDataByPeriod(formattedGdpData, selectedPeriod), [selectedPeriod, formattedGdpData]);
  const filteredPopulationData = useMemo(() => filterDataByPeriod(formattedPopulationData, selectedPeriod), [selectedPeriod, formattedPopulationData]);
  const filteredGdpPerCapitaData = useMemo(() => filterDataByPeriod(formattedGdpPerCapitaData, selectedPeriod), [selectedPeriod, formattedGdpPerCapitaData]);

  // Determine the range of the GDP values
  const gdpValues = filteredGdpData.map(item => item.gdp);
  const minGdp = Math.min(...gdpValues);
  const maxGdp = Math.max(...gdpValues);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Macroeconomic Data</h1>

      <div className="flex space-x-4 mb-4">
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
        <div className="bg-white p-4 rounded-lg shadow-lg h-[300px]" key="gdp-chart">
          <h2 className="text-2xl font-semibold mb-2">Historical GDP of Kenya</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredGdpData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis
                tickFormatter={(value: any) => formatYAxisTick(value).toString()}
                domain={[minGdp * 0.9, maxGdp * 1.1]} // Adjust domain to fit the range of data
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="gdp" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg h-[300px]" key="population-chart">
          <h2 className="text-2xl font-semibold mb-2">Historical Population of Kenya</h2>
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

        <div className="bg-white p-4 rounded-lg shadow-lg h-[300px]" key="gdp-per-capita-chart">
          <h2 className="text-2xl font-semibold mb-2">Historical GDP per Capita of Kenya</h2>
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
