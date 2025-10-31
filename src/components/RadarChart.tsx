import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface RadarChartProps {
  data: { trait: string; value: number }[];
}

export const RadarChartComponent = ({ data }: RadarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="#09dac6" strokeOpacity={0.3} />
        <PolarAngleAxis
          dataKey="trait"
          tick={{ fill: "#09dac6", fontSize: 12, fontWeight: 500 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: "#09dac6", fontSize: 10 }}
        />
        <Radar
          name="Traits"
          dataKey="value"
          stroke="#09dac6"
          fill="#09dac6"
          fillOpacity={0.4}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
