import { Text } from 'recharts';

type Props = {
  x: number;
  y: number;
  payload: {
    value: number;
  };
};

export function CustomizedXAxisTick(props: Props) {
  const { x, y, payload } = props;

  return (
    <Text
      font-size={10}
      font-weight={600}
      x={x}
      y={y}
      textAnchor="middle"
      fill="#000"
      verticalAnchor="start"
    >
      {`${payload.value} км`}
    </Text>
  );
}
