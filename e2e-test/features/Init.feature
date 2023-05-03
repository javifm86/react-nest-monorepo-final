@Mocked
Feature: AppInitialization

  @AppInitialization
  Scenario: App is initialized correctly with and without data
    Given I navigate to "examplePage"
    When Spinner is hidden
    Then Hello world message should exist