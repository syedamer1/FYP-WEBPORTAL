import Routes from "./routes";
import CustomTheme from "./themes";
import ScrollTop from "@components/ScrollTop";

const App = () => (
  <CustomTheme>
    <ScrollTop>
      <Routes />
    </ScrollTop>
  </CustomTheme>
);

export default App;
