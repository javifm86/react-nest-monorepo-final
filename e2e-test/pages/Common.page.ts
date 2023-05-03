import navigationPage from "./common/Navigation.page";
import commonSelectors from "../selectors/Common.selector";

const commonPage = {
  navigation: navigationPage,
  spinnerIsHidden() {
    cy.get(commonSelectors.spinner).should("not.exist");
  },
};

export default commonPage;
