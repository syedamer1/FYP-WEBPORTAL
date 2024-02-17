import faker from "faker";
function generateRandomPassword() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  const passwordLength = 10;
  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }
  return password;
}

function generateDummyUsers(count, avatarGender = "men") {
  const users = [];
  const userTypes = [
    "Super Administrator",
    "Province Administrator",
    "Division Administrator",
    "District Administrator",
    "Tehsil Administrator",
    "Hospital Administrator",
  ];

  for (let i = 0; i < count; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const cnic = faker.random.number({ min: 1000000000, max: 9999999999 });
    const contact = faker.phone.phoneNumberFormat();
    const password = generateRandomPassword();
    const address = faker.address.streetAddress();
    const created_on = faker.date.past(2);
    const updated_on = faker.date.between(created_on, new Date());
    const avatar = `https://randomuser.me/api/portraits/${avatarGender}/${Math.floor(
      Math.random() * 100
    )}.jpg`;

    users.push({
      id: i + 1,
      firstName,
      lastName,
      email,
      cnic,
      userType: userTypes[Math.floor(Math.random() * userTypes.length)],
      contact,
      password,
      address,
      created_on,
      updated_on,
      avatar,
    });
  }

  return users;
}

export const data = generateDummyUsers(50);
