const generateDummyDataWithoutFaker = (count) => {
  const data = [];

  for (let i = 0; i < count; i++) {
    const user = {
      id: i + 1,
      area: `City${i + 1}`,
      country: 'Country',
      province: `State${i + 1}`,
      division: `County${i + 1}`,
      district: `City${i + 1}`,
      tehsil: `City${i + 1}`,
      postalcode: `ZIP${Math.floor(Math.random() * 90000) + 10000}`,
      created_at: new Date(new Date().setDate(new Date().getDate() - i)),
    };

    data.push(user);
  }

  return data;
};

export const data = generateDummyDataWithoutFaker(50); 
