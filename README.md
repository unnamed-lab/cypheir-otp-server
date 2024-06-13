# Cypheir One-Time Passcode Server

## Introduction

This project involves the development of a robust One-Time Passcode (OTP) generator that employs a time-based authentication protocol. The primary objective of this system is to enhance security measures by providing a unique, temporary passcode for authentication purposes.

The OTP generation process is initiated when a user makes a request via the frontend using an API key. Upon receiving the request, the system generates a random passkey, which can be either numeric or alphanumeric, on the server side. This passkey serves as the OTP for the user.

Once the OTP is generated, it is immediately dispatched to the user’s registered email address. This ensures that only the legitimate user, who has access to the registered email, can retrieve the OTP. Simultaneously, a hashed copy of the OTP is stored in the database. This hashed OTP provides an additional layer of security, as it prevents any unauthorized access to the original OTP.

The time-based authentication protocol ensures that the OTP is valid only for a specific duration. This further enhances the security of the system, as it reduces the window of opportunity for any potential unauthorized access.

This OTP generator is designed with a focus on security, reliability, and ease of use, making it an ideal solution for applications that require secure user authentication.


## Technologies Used

- TypeScript
- Node.js
- Express.js
- MongoDB


## Contributing

We welcome contributions from the community. Please read our CONTRIBUTING.md for the process.

## License

This project is licensed under the MIT License. See LICENSE.md for more details.

## Contact

For any queries or suggestions, please contact the project maintainers.
