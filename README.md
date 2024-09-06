# Buyverse

Buyverse is an e-commerce web application built using Node.js, Express.js, GraphQL and MongoDB. It features user authentication, a product catalog, a shopping cart, order management, payment gateway integration, and real-time notifications to provide an immersive shopping experience.

## Features

- User authentication (registration, login, password reset)
- Browse products with filtering and sorting options
- Shopping cart with product management (add, update, remove)
- Order management (place orders, track order status)
- Real-time notifications for order updates and promotions
- Payment gateway integration (Stripe, PayPal)
- User profile management
- Product reviews and ratings

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing
- Socket.IO for real-time notifications
- Stripe/PayPal for payment processing
- Nodemailer for email notifications

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Ansalpandey/Buyverse.git
    ```

2. Install dependencies:

    ```bash
    cd Buyverse
    npm install
    ```

3. Set up environment variables:

    - Create a `.env` file in the root directory.
    - Add the following variables:

    ```bash
    MONGODB_URI=<your-mongodb-connection-string>
    JWT_SECRET=<your-jwt-secret-key>
    EMAIL_USER=<your-email-username>
    EMAIL_PASS=<your-email-password>
    STRIPE_SECRET_KEY=<your-stripe-secret-key>
    PAYPAL_CLIENT_ID=<your-paypal-client-id>
    PAYPAL_SECRET=<your-paypal-secret>
    ```

4. Start the server:

    ```bash
    npm run start
    ```

    The server will start running on `http://localhost:3000`.

## API Endpoints (Client-Side)

| Method | Endpoint                  | Description                                  |
|--------|---------------------------|----------------------------------------------|
| POST   | /api/v1/users/register         | Register a new user                          |
| POST   | /api/v1/users/login            | Login a user                                 |
| POST   | /api/v1/users/reset-password   | Reset a user's password                      |
| POST   | /api/v1/users/forgot-password | Forget a user's password                     |
| POST   | /api/v1/users/request-otp     | Request OTP for account verification      |
| POST   | /api/v1/users/verify-otp   | Verify OTP recieved                          |
| GET    | /api/products              | Get all products                             |
| GET    | /api/products/:id          | Get a specific product                       |
| POST   | /api/cart                  | Add a product to the cart                    |
| GET    | /api/cart                  | Get the user's cart                          |
| PUT    | /api/cart/:id              | Update the quantity of a cart item           |
| DELETE | /api/cart/:id              | Remove a product from the cart               |
| POST   | /api/orders                | Place an order                               |
| GET    | /api/orders                | Get the user's orders                        |
| GET    | /api/orders/:id            | Get a specific order                         |
| POST   | /api/checkout/stripe       | Create a Stripe checkout session             |
| POST   | /api/checkout/paypal       | Create a PayPal payment                      |
| GET    | /api/notifications         | Get all notifications for the user           |
| GET    | /api/profile               | Get the user’s profile                       |
| PUT    | /api/profile               | Update the user’s profile                    |
| POST   | /api/reviews               | Submit a product review                      |
| GET    | /api/reviews/:productId    | Get reviews for a specific product           |

## How to Use

1. **User Authentication**:
    - Users can register and log in with a valid email and password.
    - Passwords are securely hashed using bcrypt.
    - Reset password functionality allows users to change their passwords via email.

2. **Product Catalog**:
    - Browse through the product catalog.
    - Use filters and sorting options to find the desired products.

3. **Shopping Cart**:
    - Add, update, or remove products from your shopping cart.
    - The cart is persistently managed for logged-in users.

4. **Checkout and Payment**:
    - Users can place orders and make payments using Stripe or PayPal.
    - Real-time updates for order status and payment notifications.

5. **Profile Management**:
    - Users can update their profiles and manage personal information.
    
6. **Product Reviews**:
    - Users can submit reviews and view reviews from other customers on the product page.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Create a pull request to the original repository.

## License

This project is licensed under the [MIT License](LICENSE).
