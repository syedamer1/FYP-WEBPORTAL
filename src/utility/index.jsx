import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

function formatDate(dateString) {
  if (!dateString) {
    return null;
  }
  if (!dateString.includes("T")) {
    return null;
  }
  const date = dayjs(dateString);
  if (!date.isValid()) {
    return null;
  }
  return date.format("DD/MM/YYYY");
}

function formatDatetoWordDate(dateString) {
  if (!dateString) {
    return null;
  }
  const date = dayjs(dateString);
  if (!date.isValid()) {
    return null;
  }
  return date.format("D MMMM YYYY");
}

const userType = {
  superAdmin: "Super Administrator",
  provinceAdmin: "Province Administrator",
  divisionAdmin: "Division Administrator",
  districtAdmin: "District Administrator",
  tehsilAdmin: "Tehsil Administrator",
  hospitalAdmin: "Hospital Administrator",
};

function getAreaIdByUserType(user) {
  if (user.userType === userType.superAdmin) {
    return 1000;
  } else if (user.userType === userType.provinceAdmin) {
    return user.province.id;
  } else if (user.userType === userType.divisionAdmin) {
    return user.division.id;
  } else if (user.userType === userType.districtAdmin) {
    return user.district.id;
  } else if (user.userType === userType.tehsilAdmin) {
    return user.tehsil.id;
  } else if (user.userType === userType.hospitalAdmin) {
    return user.hospital.id;
  }
  return 0;
}

function getTabIndices(userType) {
  switch (userType) {
    case "Super Administrator":
      return { province: 0, division: 1, district: 2, tehsil: 3, hospital: 4 };
    case "Province Administrator":
      return { division: 0, district: 1, tehsil: 2, hospital: 3 };
    case "Division Administrator":
      return { district: 0, tehsil: 1, hospital: 2 };
    case "District Administrator":
      return { tehsil: 0, hospital: 1 };
    case "Tehsil Administrator":
      return { hospital: 0 };
    case "Hospital Administrator":
      return { hospital: 0 };
    default:
      return {};
  }
}

export {
  formatDate,
  formatDatetoWordDate,
  getTabIndices,
  userType,
  getAreaIdByUserType,
};
