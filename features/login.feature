Feature: Login
  Background:
    Given the user is already registered

  Scenario: Successful login - first time
    Given the user did not log in previously
    When the user logs in with correct credentials
    Then they get a generated session cookie
    And login is successful

  Scenario: Successful login - subsequent times
    Given the user logged in before
    When the user logs in with correct credentials
    Then they get their session cookie back
    And login is successful

  Scenario: Unsuccessful login - wrong username
    Given the user did not log in previously
    When the user logs in with wrong username
    Then login error is returned

  Scenario: Unsuccessful login - wrong password
    Given the user did not log in previously
    When the user logs in with wrong password
    Then login error is returned
