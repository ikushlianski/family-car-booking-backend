Feature: Single booking details
  Background:
    Given Ilya is registered, can drive family honda but does not provide any cars

  Scenario: Ilya requests details for booking "Ilya - Future Event 0"
    Given there is a booking for user "ilya" on carId "ho-123456" due in 2 days called "Ilya - Future Event 0"
    When user "ilya" requests their own booking details on carId "ho-123456" due in 2 days
    Then user "ilya" gets back a booking named "Ilya - Future Event 0"

  Scenario: Details for any personal booking are available regardless of due date
    Given there is a booking for user "ilya" on carId "ho-123456" due in 23 days called "Ilya - Future Event Distant"
    When user "ilya" requests their own booking details on carId "ho-123456" due in 23 days
    Then user "ilya" gets back a booking named "Ilya - Future Event Distant"
