import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface SalaryChartProps {
  data: {
    month: string;
    salary: number;
  }[];
}

const SalaryChart = ({ data }: SalaryChartProps) => {
  return (
    <div className="card h-[300px]">
      <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Salary Trend</h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`$${value}`, 'Salary']}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: '#ddd',
            }}
          />
          <Line 
            type="monotone" 
            dataKey="salary" 
            stroke="var(--color-primary)" 
            activeDot={{ r: 6 }} 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalaryChart;
