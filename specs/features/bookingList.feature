Feature: Booking list
  Background:
    Given Papa is registered
#    And Ilya is registered
#    And Stranger is registered
#    And Papa provides car ho-12345
#    And Ilya has ho-12345 car available
#    And Stranger provides car bmw-789
#    And today is Aug 1, 2022

  Scenario: Ilya requests his own booking list
    Given there are is a booking for user Ilya for Aug 3 2022, 11:00 called Future Event 1
    When Ilya requests his own bookings
    Then he gets back a list of one item named Future Event 1

#  Scenario: Booking list includes events only 2 weeks ahead
#    Given there are is a booking for user Ilya for Aug 3 2022, 11:00 called Future Event 1
#    When Ilya requests his own bookings
#    Then Ilya's list includes only bookings not later than 2 weeks ahead
#
#  Scenario: Papa can see bookings of Ilya because Ilya drives Papa's car
#    Given there are bookings for user Ilya
#    And there are bookings for user Papa
#    When Papa requests Ilya's bookings
#    Then he gets Ilya's bookings back
#
#  Scenario: Stranger cannot see bookings of Ilya because Ilya does not drive Stranger's car
#    Given there are bookings for user Ilya
#    When Stranger requests Ilya's bookings
#    Then he gets Ilya's bookings back
