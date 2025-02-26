# API access :api:

* Never use `fetch` function to make HTTP calls to the API. Use `axios` library instead.
* Use information from `openapi.yaml` to create TypeScript types for JSON objects used in the API. 
  Review the file to verify the required data structures, parameters, and response formats are accurately followed in your explanations and examples.
* Make sure that the functions and classes used to access the API can be mocked in tests.
* Never perform API requests directly in React components code, use API functions located in `src/services/` directory.
