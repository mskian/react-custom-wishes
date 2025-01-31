import slugify from 'slugify';

export const getGreetingType = () => {
  const now = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });

  const hour24 = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "numeric",
  });

  const hour = parseInt(hour24, 10);

  let greeting = { type: 'night', currentTime: now };

  if (hour < 12) {
    greeting = { type: 'morning', currentTime: now };
  } else if (hour < 17) {
    greeting = { type: 'afternoon', currentTime: now };
  } else if (hour < 20) {
    greeting = { type: 'evening', currentTime: now };
  }

  return greeting;
};

export const sanitizeInput = (input) => {
  return slugify(input, {
    lower: true,
    strict: false,
    remove: /[*+~.()'"!:@]/g,
  });
};
