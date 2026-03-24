class AbstractHandler {
  setNext(handler) {
    this.nextHandler = handler;
    return handler;
  }

  handle(request) {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return 'Request processed';
  }
}

class MonkeyHandler extends AbstractHandler {
  handle(request) {
    if (request === 'Nut') {
      return `Squirrel: I'll eat the ${request}.`;
    }
    return super.handle(request);
  }
}

class DogHandler extends AbstractHandler {
  handle(request) {
    if (request === 'MeatBall') {
      return `Dog: I'll eat the ${request}.`;
    }
    return super.handle(request);
  }
}

const monkey = new MonkeyHandler();
const dog = new DogHandler();

monkey.setNext(dog);
console.log(monkey.handle('Nut'));
console.log(monkey.handle('MeatBall'));
console.log(monkey.handle('Banana'));

// Auth example
class AuthHandler extends AbstractHandler {
  handle(request) {
    if (!request.user) {
      return 'Unauthorized';
    }
    return super.handle(request);
  }
}

class LoggingHandler extends AbstractHandler {
  handle(request) {
    console.log(`Request for ${request.url}`);
    return super.handle(request);
  }
}

const auth = new AuthHandler();
const logger = new LoggingHandler();

auth.setNext(logger);

console.log(auth.handle({ url: '/dashboard', user: null }));
console.log(auth.handle({ url: '/dashboard', user: { id: 1 } }));

// Express example
import express from 'express';

const app = express();

app.use((req, _, next) => {
  console.log(`${new Date().toISOString()} 
    - ${req.method} ${req.url}`);
  next();
});

const checkAuth = (req, res, next) => {
  if (req.headers['authorization']) {
    next();
  } else {
    res.status(401).send('Unauthorized Access');
  }
};

app.get('/admin', checkAuth, (_, res) => {
  res.send('Welcome to the Admin Panel!');
});

app.listen(3000);
