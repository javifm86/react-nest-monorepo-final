import { When } from '@badeball/cypress-cucumber-preprocessor';
import commonPage from '../../pages/Common.page';

When(/^Spinner is hidden$/, function () {
  commonPage.spinnerIsHidden();
});