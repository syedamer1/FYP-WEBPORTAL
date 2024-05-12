import axios from "axios";
const fetchDisease$ = async ({ setDisease }) => {
  try {
    const response = await axios.get("http://localhost:8080/disease/get");
    setDisease(response.data.map((disease) => disease.name));
  } catch (error) {
    console.error("Error fetching disease names:", error);
  }
};
export default fetchDisease$;
