### React components :react:
* React components files should have a suffix 'Component.tsx' and placed in 'src/components' folder
* Crucial: react components should use the following **Universal Props and State Rule:**
  1. **Passing External Data Through Props:**
     All data related to the external context of the component (including, but not limited to, state, functions, objects, and other dependencies) MUST be passed into the component exclusively THROUGH PROPS.
     This ensures its modularity, increases reusability, and simplifies testing, as it makes the component as independent as possible from external contexts.
     In cases where external calls (e.g., API requests) or interactions with external state managers (through Redux, Context API, etc.) are necessary, such operations MUST be conducted at a higher level (e.g., in container components) and passed down to your component THROUGH PROPS.
  2. **Limiting Internal State:** If a component uses its internal state, that state must be strictly limited to the functionality of that component and should not depend on external calls or states.
     Such an approach guarantees that changes within the component do not directly affect the external system or other components.
* Add the `data-testid` attribute to all HTML element in your React components. This attribute will serve as a unique identifier for the element during testing.