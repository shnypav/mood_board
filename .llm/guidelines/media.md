### Media :media:

* If a user requests images for a website in the specification, you MUST use the "add_image" action to add
  images while developing the frontend. Do NOT create a service for fetching images, all static images must be stored on frontend.
* Be specific when creating an image description. For example, search for "playful golden retriever puppy sitting in a grassy park on a sunny day" instead of just "dog".
* All images MUST be stored in the `public/assets/` folder on the frontend.
  For example, to reference the image, use this path: `assets/imageName.jpg`.
* If you want to add an image to the website, ensure it exists in `public/assets/`.
* Adjust images to the appropriate size.
* Never use `add_image` action for logo and icons, use icons from `lucide-react` library instead.
* Never use `add_image` action for full-page backgrounds.