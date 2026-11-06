# BDD proof-of-concept: re-expresses the "h1 header is as expected" check from
# tests/functional.spec.ts in Gherkin, run for each manufacturer listed below.
Feature: Manufacturer page content

  Scenario Outline: Manufacturer page shows the manufacturer name as its heading
    Given I am on the "<Manufacturer>" manufacturer page
    Then the page heading should be "<Manufacturer>"

    Examples:
      | Manufacturer     |
      | Vortix           |
      | Halden Locks UK  |
