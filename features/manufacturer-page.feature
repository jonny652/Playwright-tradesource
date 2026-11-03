Feature: Manufacturer page content

  # Runs once per row in the Examples table, top to bottom. <Manufacturer> is replaced with each row's value.
  # Names must match a "name" in test-data/manufacturers.json (the step looks up the URL from there).
  Scenario Outline: Manufacturer page shows the manufacturer name as its heading
    Given I am on the "<Manufacturer>" manufacturer page
    Then the page heading should be "<Manufacturer>"

    Examples:
      | Manufacturer     |
      | Vortix           |
      | Halden Locks UK  |
