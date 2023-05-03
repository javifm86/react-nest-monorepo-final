import { Then } from "@badeball/cypress-cucumber-preprocessor";
import mainScreenPage from "../../pages/MainScreen.page";

Then(/^Hello world message should exist$/, function () {
  mainScreenPage.checkHelloWorld();
});
