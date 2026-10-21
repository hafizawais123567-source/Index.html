# Dzone PKP – Lasani Mobile online shop
Zero dependencies. Needs Node 18+.

    npm start        # then open http://localhost:3000   (PORT=4000 npm start to change)

## Where to edit
- Products, prices, offers, images: `public/js/data/products.js`
  (set `oldPrice` higher than `price` to show a discount badge; put photos in `public/assets/products/` and set `image: 'assets/products/name.jpg'`)
- Shop name, phone / WhatsApp number, address, currency: `public/js/config.js`
- FAQ, About, Guide, Privacy Policy, Terms, footer text: `public/index.html`
- Colours and layout: `public/css/styles.css`
- Hero scroll animation frames (shown first, then products): `public/frames/001.jpg … 150.jpg`
