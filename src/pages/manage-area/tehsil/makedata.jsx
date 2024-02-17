export const data = [
  {
    id: "1",
    name: "Mirpur Tehsil",
    district_name: "Mirpur District",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "2",
    name: "Kotli Tehsil",
    district_name: "Kotli District",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "3",
    name: "Islamgarh Tehsil",
    district_name: "Mirpur District",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "4",
    name: "Rawalakot Tehsil",
    district_name: "Poonch District",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "5",
    name: "Bagh Tehsil",
    district_name: "Bagh District",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "6",
    name: "Dadyal Tehsil",
    district_name: "Mirpur District",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "7",
    name: "Haveli Tehsil",
    district_name: "Haveli District",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "8",
    name: "Muzaffarabad Tehsil",
    district_name: "Muzaffarabad District",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "9",
    name: "Athmuqam Tehsil",
    district_name: "Neelum District",
    created_on: getRandomDate(),
    updated_on: getRandomDate(),
  },
  {
    id: "10",
    name: "Bhimber Tehsil",
    district_name: "Bhimber District",
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
