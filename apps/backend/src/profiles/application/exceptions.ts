class UserAlreadyExistsException extends Error {
	constructor(public message: string) {
		super(message);
	}
}

class UserNotFoundException extends Error {
	constructor(public message: string) {
		super(message);
	}
}

export { UserAlreadyExistsException, UserNotFoundException };
