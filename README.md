# Tastes of Africa

**Leila Omol**

## Project Overview

Tastes of Africa promotes African food heritage by pairing practical recipes with the history and culture behind them. Users can:

- browse recipes and filter them by region without reloading the page
- save favourite recipes, which stay saved after a refresh
- scale any recipe's ingredients up or down for a different number of servings
- switch between light and dark mode
- watch cooking tutorials and see each dish's origin on a map
- send a message through a validated contact form and sign up for a newsletter

---

## Pages

| Page | File | Contents |
|------|------|----------|
| Home | `index.html` | Hero section with background image, welcome text and YouTube video; four featured dishes; links to three regions; three food-trend articles |
| Recipes | `recipes.html` | All seven recipe cards with region filter buttons and favourite buttons |
| Recipe pages (x7) | `recipes/*.html` | Image, cultural description, ingredient list with serving scaler, expandable instructions, YouTube tutorial, nutrition table, map of origin |
| Culinary Regions | `regions.html` | Overview of the three regions |
| Region pages (x3) | `regions/*.html` | Food culture, staple foods, cooking techniques and spices, video, example dishes with recipe links |
| About Us | `about.html` | Mission statement, history of African cuisine and its global influence, Google Map of a food landmark |
| Contact | `contact.html` | Contact form with name, email, country, topic and message fields |

---

## JavaScript Features

### 1. Dark / light mode toggle
Clicking the moon or sun button in the header adds or removes `data-theme="dark"` on the `<html>` element. The choice is saved in `localStorage`; on a first visit, the site follows the device's own light or dark setting.

### 2. Mobile navigation
The hamburger button opens and closes the menu on small screens and updates `aria-expanded` for screen readers.

### 3. Recipe filter
Each recipe card has a `data-region` attribute (for example `data-region="west-africa"`). Clicking a filter button runs a loop over all cards and adds or removes the `.hidden` class. A **My Favorites** button shows only saved recipes, and a status line announces how many recipes are visible.

### 4. Add to Favorites
Each card and recipe page has a Favorite button. Clicking it fills the heart red, changes the label to "Saved" and stores the recipe ID in `localStorage` (e.g `["pilau","egusi"]`). On every page load, the saved IDs are read back and the buttons are restored.

### 5. Ingredient scaler
Each quantity is wrapped in `<span class="qty" data-qty="2">`. Changing the servings multiplies every quantity by (new servings ÷ original servings) and displays friendly fractions such as ½ and ¾.

### 6. Contact form validation
On submit, `event.preventDefault()` stops the page from reloading. The script checks that a name is entered, the email is valid and the message is **more than 20 characters**, showing a clear error under any field that fails. A live counter shows progress towards the minimum length. When everything is valid, the form is hidden and the message *"Thank you, [Name]! We've received your message."* is built from the name the user typed.

### 7. Newsletter signup
The footer form checks the email address and shows a confirmation or error message without reloading the page.

### 8. Video help
If the site is opened directly as a file, where YouTube refuses to play embedded videos, the script detects this with `window.location.protocol` and places a short explanation over each video.

---

## Folder Structure

```
taste_of_africa_website_project/
├── index.html              Home page
├── recipes.html            All recipes, filter and favourites
├── regions.html            Culinary regions overview
├── about.html              About Us
├── contact.html            Contact form
├── styles.css              All styling
├── script.js               All interactivity
├── README.md               Project documentation
├── recipes/
│   ├── matoke.html
│   ├── pilau.html
│   ├── mchicha.html
│   ├── egusi.html
│   ├── tilapia.html
│   ├── kuku-kienyeji.html
│   └── tagine.html
├── regions/
│   ├── east-africa.html
│   ├── west-africa.html
│   └── north-africa.html
└── images/
    ├── README.md           List of every image and location
    ├── hero.jpg
    ├── about.jpg
    ├── east-africa.jpg, west-africa.jpg, north-africa.jpg
    └── matoke.jpg, pilau.jpg, mchicha.jpg, egusi.jpg,
        tilapia.jpg, kuku-kienyeji.jpg, tagine.jpg
```
---

## Credits

**Fonts:** [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) and [Mulish](https://fonts.google.com/specimen/Mulish) from Google Fonts.

**Maps:** Google Maps embeds.

**Videos:** Tutorials are embedded from their creators' YouTube channels and remain the property of their owners.

| Page | Video |
|------|-------|
| Home, Pilau | [Cooking traditional pilau](https://www.youtube.com/watch?v=50UG9I1t1rg) |
| Matoke, East Africa | [Cooking matooke with chicken](https://www.youtube.com/embed/KYaqSULFlLA?si=wKG71Ha_dejM9fel) |
| Mchicha wa Nazi | [Mchicha wa nazi – spinach in coconut milk](https://www.youtube.com/embed/2gp_3_LJdeE?si=WK04Tw9LrQcD-dvP) |
| Egusi Soup, West Africa | [How to make Nigerian egusi soup](https://www.youtube.com/embed/qZ1vidSN41Q?si=pbmp87cE17JZFFAW) |
| Kenyan Tilapia | [Kenyan style fish wet fry](https://www.youtube.com/embed/ZYGPKDdWLys?si=OFBJUXz15pxdT2oR) |
| Kuku Kienyeji | [Kienyeji chicken stew – Terry's Kitchen](https://www.youtube.com/embed/7S9gc4WXoyw?si=ujVYdU24FBG2MYDb) |
| Chicken Tagine | [Moroccan chicken tagines](https://www.youtube.com/embed/R8fyTivC6lM?si=2CkcCYg9aXQM9g77) |
| North Africa | [Moroccan vegetable tagine](https://www.youtube.com/embed/CpVQElpwbdg?si=7cT0rZg4mSiSxxzd) |

**Recipes and text:** Home style versions written for this project. Nutrition values are approximate.
