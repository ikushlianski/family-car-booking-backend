Feature: Booking list
  Background:
    Given Papa is registered, provides a family honda car and can drive it
    And Ilya is registered, can drive family honda but does not provide any cars
    And Stranger is registered, provides a BMW and can drive it

  Scenario: Ilya requests his own booking list
    Given there is a booking for user Ilya for Aug 3 2022, 11:00 called Future Event 1
    When Ilya requests his own bookings
    Then Ilya gets back a list of one item named Future Event 1

#  Scenario: Booking list includes events only 2 weeks ahead
#    Given there are is a booking for user Ilya for Aug 3 2022, 11:00 called Future Event 1
#    When Ilya requests his own bookings
#    Then Ilya's list includes only bookings not later than 2 weeks ahead
#
#  Scenario: Papa can see bookings of Ilya because Ilya drives Papa's car
#    Given there are is a booking for user Ilya for Aug 3 2022, 11:00 called Future Event 1
#    And there are bookings for user Papa
#    When Papa requests Ilya's bookings
#    Then he gets Ilya's bookings back
#
#  Scenario: Stranger cannot see bookings of Ilya because Ilya does not drive Stranger's car
#    Given there are bookings for user Ilya
#    When Stranger requests Ilya's bookings
#    Then he gets Ilya's bookings back
