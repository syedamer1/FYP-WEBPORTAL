export const data = [
  {
    id: "1",
    name: "Azad Kashmir",
    province_name: "Azad Kashmir",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "2",
    name: "Balochistan",
    province_name: "Balochistan",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "3",
    name: "Gilgit-Baltistan",
    province_name: "Gilgit-Baltistan",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "4",
    name: "Khyber Pakhtunkhwa",
    province_name: "Khyber Pakhtunkhwa",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "5",
    name: "Punjab",
    province_name: "Punjab",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "6",
    name: "Sindh",
    province_name: "Sindh",
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
