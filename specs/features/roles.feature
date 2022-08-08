#Feature: Roles
#  Background:
#    Given Papa is registered, provides a family honda car and can drive it
#    And Ilya is registered, can drive family honda but does not provide any cars
#    And Stranger is registered, provides a BMW and can drive it
#
#  Scenario: Papa can see bookings of Ilya because Ilya drives Papa's car
#    Given there is a booking for user Ilya due in 2 days called "Ilya - Future Event 1"
#    And there are bookings for user Papa
#    When Papa requests Ilya's bookings
#    Then he gets Ilya's bookings back
#
#  Scenario: Stranger cannot see bookings of Ilya because Ilya does not drive Stranger's car
#    Given there is a booking for user Ilya due in 2 days called "Ilya - Future Event 1"
#    When Stranger requests Ilya's bookings
#    Then he gets Ilya's bookings back

#  Scenario: Booking details for other people available
