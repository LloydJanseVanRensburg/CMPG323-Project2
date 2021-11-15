export const validateLoginAuthBody = (body: any) => {
  return (
    isDefined(body) &&
    objectLength(body) > 0 &&
    isDefined(body.email) &&
    isString(body.email) &&
    isDefined(body.password) &&
    isString(body.password)
  );
};

export const validateRegisterAuthBody = (body: any) => {
  return (
    isDefined(body) &&
    objectLength(body) > 0 &&
    isDefined(body.username) &&
    isString(body.username) &&
    isDefined(body.email) &&
    isString(body.email) &&
    isDefined(body.password) &&
    isString(body.password)
  );
};

export const validateCreateGroupBody = (body: any) => {
  return (
    isDefined(body) &&
    objectLength(body) > 0 &&
    isDefined(body.title) &&
    isString(body.title) &&
    isDefined(body.description) &&
    isString(body.description)
  );
};

export const isString = (string: any) => {
  return typeof string === 'string' || string instanceof String;
};

export const isDefined = (param: any) => {
  if (param) {
    return true;
  }
  return false;
};

export const objectLength = (data: Object) => {
  let length = 0;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      length++;
    }
  }

  return length;
};
