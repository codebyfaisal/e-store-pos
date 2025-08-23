import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const ChartCard = ({ title, chartType, data, options,className }) => (
  <div className={`card bg-base-100 ${className}`} >
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
      {chartType === "Pie" && <Pie data={data} options={options} />}
      {chartType === "Bar" && <Bar data={data} options={options} />}
      {chartType === "Line" && <Line data={data} options={options} />}
    </div>
  </div>
);

export default ChartCard;
