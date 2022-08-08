Feature: Booking list
  Background:
    Given Papa is registered, provides a family honda car and can drive it
    And Ilya is registered, can drive family honda but does not provide any cars
    And Stranger is registered, provides a BMW and can drive it

  Scenario: Ilya requests details for booking "Ilya - Future Event 0"
    Given there is a booking for user "ilya" on carId "ho-123456" due in 2 days called "Ilya - Future Event 0"
    When Ilya requests his own bookings
    Then Ilya gets back a list of 1 items named "Ilya - Future Event 0"

  Scenario: Booking list includes events only 2 weeks ahead
    Given there is a booking for user "ilya" on carId "ho-123456" due in 2 days called "Ilya - Future Event 0"
    And there is a booking for user "ilya" on carId "ho-123456" due in 13 days called "Ilya - Future Event 1"
    And there is a booking for user "ilya" on carId "ho-123456" due in 22 days called "Ilya - Future Event 3"
    When Ilya requests his own bookings
    Then Ilya gets back a list of 2 items
    And item 0 is called "Ilya - Future Event 0"
    And item 1 is called "Ilya - Future Event 1"
