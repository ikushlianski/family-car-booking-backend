Feature: Logout API
  Background:
    Given the user is already registered
    And the user logged in before

  Scenario: Successful logout
    When the user logs out using a cookie
    Then logout is successful

  Scenario: Unsuccessful logout - user tries to log out without a cookie
    When the user logs out without a cookie
    Then logout is unsuccessful
    And user retains their sessionId
