export function formatDate(dateString) {
  if (!dateString || dateString === null) {
    return null;
  }
  if (!dateString.includes("T")) {
    return null;
  }
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDate2(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
}
