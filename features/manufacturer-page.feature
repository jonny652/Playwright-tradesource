Feature: Manufacturer page content

  Scenario Outline: Manufacturer page shows the manufacturer name as its heading
    Given I am on the "<Manufacturer>" manufacturer page
    Then the page heading should be "<Manufacturer>"

    Examples:
      | Manufacturer     |
      | Vortix           |
      | Halden Locks UK  |
