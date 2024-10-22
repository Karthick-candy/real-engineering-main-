Real Engineering
Overview:
    Real Engineering is an eCommerce-like website designed for the manufacturers of springs, mattress-related products, and mattress machineries. 
    The platform enables users to browse products, request machinery services, and inquire about the company. 
    It includes an admin interface for managing products and services, with JWT-based authentication and authorization for secure access to admin functionalities.

Key Features:
    Product Display: Categorized products fetched from the database via API calls.
    Service Request: Users can request machinery services by filling out a form, and the details are sent directly to the company's WhatsApp account via API.
    Inquiry Form: Users can make inquiries or ask for support via a contact form. Gmail Sign-In integration allows authenticated users to send inquiries directly to the company’s support team via email.
    Admin Interface: CRUD (Create, Read, Update, Delete) operations for products and admin management are handled through a secured admin dashboard. Token-based authentication ensures that only authorized admins can make changes.
    Order Management: Admins can manage user orders, including closing orders after completion (further improvements on order closure and user registration/login are in progress).
    Company Map Location: A map showing the company's location is included in the Contact Us page for user convenience.
    
Tech Stack:
    Frontend: React.js
    Backend: Python Django
    Database: MySQL (with XAMPP)
    API: REST API (for client-server communication)
    Authentication: JSON Web Token (JWT) for admin login and secured operations
    
Other Integrations:
    WhatsApp API (for service requests)
    Gmail Sign-In (for inquiry form)
    Google Maps (for displaying company location)
    
Project Structure:
    Home Page: An introductory page showcasing the company’s offerings.
    About Us: Information about the company and its mission.
    Products Page: Lists all products fetched from the database, categorized based on product type.
    Services Page: Allows users to submit service requests for machinery via WhatsApp API.
    Contact Us Page: Provides an inquiry form and company map location for user support and feedback.
    Admin Interface: Includes a dashboard for performing CRUD operations on products and managing admin accounts.
    
Admin Dashboard (CRUD with Token Verification):
    The admin dashboard allows authorized admins to manage products and other operations. 
    Every request is authenticated using a JWT token to ensure secure access.

    JWT Authentication: Secure token-based authentication for admins.
    Product Management: CRUD functionality for products, allowing admins to add, update, or delete products.
    Create: Admins can add new products to the database.
    Read: All products are fetched from the database and displayed on the dashboard.
    Update: Admins can modify existing products.
    Delete: Products can be removed from the database by authorized admins.
    
Admin Management:
    Admins can view a list of current admins.
    New admins can be added through the Admin Registration Form, which saves the new admin details in the database.
    
Order Management:
    All user orders are displayed in the order management section, categorized by product type. Admins can close orders after processing.

APIs Implemented
    Products API: To fetch, create, update, and delete products from the database with token verification.
    Service Request API: Sends user-submitted service requests to the company’s WhatsApp account.
    Inquiry API: Submits inquiries from users to the company’s support team via email (with Gmail Sign-In integration).
    Admin Authentication API: Handles JWT-based admin login, ensuring secure access for CRUD operations.
    Admin Registration API: Allows new admins to be added through the admin registration form and saved in the database.
    Order Management API: Allows admins to manage and close orders placed by users.

Future Improvements:
    User Registration & Login: Implement a registration and login system for users, requiring them to log in before they can place an order.
    Order Closure Enhancements: Improve the order closing functionality by notifying users (via message or email) when their order has been closed and is ready for delivery.
    Forgot Password for Admins: Add a "Forgot Password" feature for the admin login page to help admins recover their credentials securely.
