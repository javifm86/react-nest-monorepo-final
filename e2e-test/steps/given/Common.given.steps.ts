import { Given } from '@badeball/cypress-cucumber-preprocessor';

import commonPage from '../../pages/Common.page';

Given(/^I navigate to "(.*)"$/, function (path: string) {
  commonPage.navigation.start(`/`);
});
