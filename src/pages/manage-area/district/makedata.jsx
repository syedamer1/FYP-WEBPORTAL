export const data = [
  {
    id: "1",
    division_name: "Mirpur",
    name: "Mirpur",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "2",
    division_name: "Mirpur",
    name: "Kotli",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "3",
    division_name: "Mirpur",
    name: "Bhimber",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "4",
    division_name: "Mirpur",
    name: "Pallandri",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "5",
    division_name: "Mirpur",
    name: "Sudhanoti",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
];
function getRandomDate() {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
    .toISOString()
    .split("T")[0];
}
