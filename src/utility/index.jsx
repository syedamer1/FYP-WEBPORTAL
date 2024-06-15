import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

export function formatDate(dateString) {
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

export function formatDatetoWordDate(dateString) {
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

export default userType;
