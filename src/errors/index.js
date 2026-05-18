class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends AppError {
  constructor(message, errors = null) {
    super(message, 400);
    this.errors = errors;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resourse not found") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resourse already exists") {
    super(message, 409);
  }
}
