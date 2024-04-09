export function PriorityBadge(props: { priority: number }) {
  const { priority } = props;

  switch (priority) {
    case 1:
      return <span className="rounded-md text-black bg-orange-300 px-2 py-1">Высокий</span>;
    case 2:
      return <span className="rounded-md text-black  px-2 py-1 bg-[#FFF0B9]">Средний</span>;
    case 3:
      return <span className="rounded-md text-black px-2 py-1 bg-[#F4ECD5]">Низкий</span>;

    default:
      return <span className="rounded-md">{priority}</span>;
  }
}
